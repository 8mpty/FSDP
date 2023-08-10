const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Admin, Sequelize } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');
const { sign } = require('jsonwebtoken');
const { transporter, generateVerificationCode, sendEmail } = require("./brevoEmail");
require('dotenv').config();


// Get all Admins
router.get("/getAllAdmins", async (req, res) => {
    try {
        let condition = {};
        let search = req.query.search;

        if (search) {
            condition[Sequelize.Op.or] = [
                { name: { [Sequelize.Op.like]: `%${search}%` } },
                { email: { [Sequelize.Op.like]: `%${search}%` } }
            ];
        }

        let admins = await Admin.findAll({
            where: condition,
            attributes: ['id', 'name', 'email', 'isDeleted'],
        });

        res.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Authorization Checks
router.get("/auth", validateToken, (req, res) => {
    let adminInfo = {
        id: req.admin.id,
        email: req.admin.email,
        name: req.admin.name
    };
    res.json({
        admin: adminInfo
    });
});

// Register Admin
router.post("/registerAdmin", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50).required(),
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    })
    try {
        await validationSchema.validate(data,
            { abortEarly: false });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Trim string values
    data.name = data.name.trim();
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();

    // Check email
    let admin = await Admin.findOne({
        where: { email: data.email }
    });

    let adminCount = await Admin.count({
        where: { email: data.email }
    });

    if (adminCount > 1) {
        let existingAdmin = await Admin.findOne({
            where: { email: data.email, isDeleted: false }
        });
        if (existingAdmin) {
            res.status(400).json({ message: "Email already exists." });
            return;
        } else if (!existingAdmin) {
            admin = existingAdmin;
        }
    }

    if (admin) {
        if (admin.isDeleted === false) {
            res.status(400).json({ message: "Email already exists." });
            return;
        } else if (admin.isDeleted === true && adminCount > 1) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }
    }

    // Hash passowrd
    data.password = await bcrypt.hash(data.password, 10);

    const verificationCode = generateVerificationCode();
    data.verificationCode = verificationCode;

    let result = await Admin.create(data);

    try {
        await sendEmail(
            data.email,
            "Account Secure Code",
            `Your account verification code is: ${verificationCode}. 
            Please keep this safe as it will help in recovering your account if lost!`
        );
    } catch (error) {
        console.error("Error sending verification code email:", error);
    }
    transporter.close();

    res.json(result);
});

// Login Admin
router.post("/loginadmin", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    })
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Trim string values
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();

    // Check email and password
    let errorMsg = "Email or password is not correct.";
    let admin = await Admin.findOne({
        where: { email: data.email }
    });
    if (!admin) {
        res.status(400).json({ message: errorMsg });
        return;
    }

    let adminCount = await Admin.count({
        where: { email: data.email }
    });

    if (adminCount > 1) {
        let hasActiveAdmin = await Admin.findOne({
            where: { email: data.email, isDeleted: false }
        });
        if (hasActiveAdmin) {
            admin = hasActiveAdmin;
        } else {
            res.status(400).json({ message: errorMsg });
            return;
        }
    }

    if (admin.isDeleted) {
        res.status(400).json({ message: errorMsg });
        return;
    }

    let match = await bcrypt.compare(data.password, admin.password);
    if (!match) {
        res.status(400).json({ message: errorMsg });
        return;
    }

    // Return Admin info
    let adminInfo = {
        id: admin.id,
        email: admin.email,
        name: admin.name
        // password: admin.password
    };
    let accessToken = sign(adminInfo, process.env.APP_SECRET);
    res.json({
        accessToken: accessToken,
        admin: adminInfo
    });
});

// Get the Details of Admin from Specific ID
router.get("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let admin = await Admin.findByPk(id);
    if (!admin) {
        res.status(400).json({ message: `Cannot find account with ID ${id}` })
        return;
    }
    res.json(admin);
});

// Delete Admin Account of Specific ID
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let admin = await Admin.findByPk(id);

    if (!admin) {
        res.sendStatus(404)
        return;
    }

    // Add a check for the default admin
    if (admin.id === 1) {
        res.status(403).json({ message: "Default admin cannot be deleted." });
        return;
    }

    let adminNum = await Admin.destroy({
        where: { id: id }
    })

    if (adminNum == 1) {
        res.json({
            message: `Admin ${admin.name} has been deleted successfully!`
        });
    }
    else {
        res.status(400).json({
            message: `Cannnot delete ${admin.name} account!`
        })
    }
});

// Update Admin Particulars
router.put("/updateAdmin/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50),
        email: yup.string().trim().email().max(50),
        password: yup.string().trim().min(8).max(50),
    });

    try {
        await validationSchema.validate(data, { abortEarly: false });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Trim string values if present
    if (data.name) {
        data.name = data.name.trim();
    }
    if (data.email) {
        data.email = data.email.trim().toLowerCase();
    }
    if (data.password) {
        data.password = data.password.trim();
        data.password = await bcrypt.hash(data.password, 10); // Hash the new password
    }

    // Update Admin
    try {
        let admin = await Admin.findByPk(id);

        if (!admin) {
            res.status(404).json({ message: `Admin with ID ${id} not found.` });
            return;
        }

        // Update admin's data directly
        Object.assign(admin, data);

        // Save the updated admin
        await admin.save();

        res.json(admin);
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Account Recovery - Verify email and verification code and update password
router.post("/accountRecoveryAdmin", async (req, res) => {
    const { email, newPassword, confirmPassword, verificationCode } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ where: { email, isDeleted: false } });

    if (!admin) {
        res.status(404).json({ message: "Admin not found." });
        return;
    }

    // Check if the verification code matches
    if (admin.verificationCode !== verificationCode) {
        res.status(400).json({ message: "Invalid verification code." });
        return;
    }

    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
        res.status(400).json({ message: "Passwords do not match." });
        return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and reset the verification code in the database
    admin.password = hashedPassword;
    // admin.verificationCode = null; // Reset the verification code after successful password reset

    // Save the admin with the verification code intact
    await admin.save();

    res.json({ message: "Password updated successfully." });
});

// Account Recovery - Resend verification code
router.post("/resendVerificationCode", async (req, res) => {
    const { email } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ where: { email, isDeleted: false } });

    if (!admin) {
        res.status(404).json({ message: "Admin not found." });
        return;
    }

    const verificationCode = generateVerificationCode();
    admin.verificationCode = verificationCode;
    await admin.save();

    try {
        await sendEmail(email,
            "New Verification Code Requested",
            `Your new verification code is: ${verificationCode}`
        );
    } catch (error) {
        console.error("Error sending verification code email:", error);
        res.status(500).json({ message: "Failed to send verification code." });
        return;
    }

    res.json({ message: "Verification code sent successfully." });
});

router.put("/softDeleteAdmin/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    try {
        let admin = await Admin.findByPk(id);
        if (!admin) {
            res.status(404).json({ message: `Admin with ID ${id} not found.` });
            return;
        }
        if (!admin.isDeleted) {
            admin.isDeleted = true;
            // Save the updated status of admin
            await admin.save();
            res.json({ message: "Admin has been DELETED and can't be used to log in." });
        } else {
            res.status(400).json({ message: "Admin is already in deleted status" });
        }
    } catch (error) {
        console.error('Error updating isDeleted status:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;