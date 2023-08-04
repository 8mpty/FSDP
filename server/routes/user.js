const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, Sequelize, UserLoginHistory } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');
const { sign } = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const dayjs = require('dayjs');
require('dotenv').config();


const brevSMTP = {
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
};
const transporter = nodemailer.createTransport(brevSMTP);
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Get all Users
router.get("/getAllUsers", async (req, res) => {
    try {
        let condition = {};
        let search = req.query.search;

        if (search) {
            condition[Sequelize.Op.or] = [
                { name: { [Sequelize.Op.like]: `%${search}%` } },
                { email: { [Sequelize.Op.like]: `%${search}%` } }
            ];
        }
        const users = await User.findAll({
            where: condition,
            attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt', 'requestDelete', 'requestAsDriver', 'driverStatus', 'isDeleted'],
        });

        res.json(users);
    } catch (error) {
        console.error('Error fetching Users:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Authorization Checks
router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    };
    res.json({
        user: userInfo
    });
});

// Register User
router.post("/register", async (req, res) => {
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
    let user = await User.findOne({
        where: { email: data.email }
    });

    let countUsers = await User.count({
        where: { email: data.email }
    });

    if (countUsers > 1) {
        let existingUser = await User.findOne({
            where: { email: data.email, isDeleted: false }
        });
        if (existingUser) {
            res.status(400).json({ message: "Email already exists." });
            return;
        } else if (!existingUser) {
            user = existingUser;
        }
    }
    // If user exists
    if (user) {
        // If the user exists, check if it is marked as not deleted
        if (user.isDeleted === false) {
            res.status(400).json({ message: "Email already exists." });
            return;
        } else if (user.isDeleted === true && countUsers > 1) {
            res.status(400).json({ message: "Email already exists." });
            return;
        }
    }

    data.password = await bcrypt.hash(data.password, 10);

    const verificationCode = generateVerificationCode();
    data.verificationCode = verificationCode;

    data.requestDelete = false;
    data.requestAsDriver = false;
    data.driverStatus = false;
    data.isDeleted = false;

    // Create User
    let result = await User.create(data);

    // Send the verification code to the user's email
    try {
        await transporter.sendMail({
            from: process.env.BREVO_USER,
            to: data.email,
            subject: "Account Secure Code",
            text: `Your account verification code is: ${verificationCode}. 
            Please keep this safe as it will help in recovering your account if lost!`,
        });
    } catch (error) {
        console.error("Error sending verification code email:", error);
    }
    transporter.close();

    res.json(result);
});

// Login User
router.post("/login", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required(),
    });
    try {
        await validationSchema.validate(data, { abortEarly: false, strict: true });
    } catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Trim string values
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();

    try {
        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await User.findOne({
            where: { email: data.email },
        });

        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        let countUsers = await User.count({
            where: { email: data.email },
        });

        if (countUsers > 1) {
            let hasActiveUser = await User.findOne({
                where: { email: data.email, isDeleted: false },
            });
            if (hasActiveUser) {
                user = hasActiveUser;
            } else {
                res.status(400).json({ message: errorMsg });
                return;
            }
        }

        if (user.isDeleted) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        const today = dayjs().add(0, 'days').format('YYYY-MM-DD');

        let logDetails = await UserLoginHistory.findOne({
            where: { 
                userId: user.id, 
                date: today 
            },
        });

        if (!logDetails) {
            logDetails = await UserLoginHistory.create({
                userId: user.id,
                date: today,
                loginSuccess: 1,
            });
        } else {
            logDetails.loginSuccess += 1;
            await logDetails.save();
        }
        await user.save();

        // Return User info
        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        let accessToken = sign(userInfo, process.env.APP_SECRET);
        res.json({
            accessToken: accessToken,
            user: userInfo
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get("/loginLogs", async (req, res) => {
    try {
        const loginLogs = await UserLoginHistory.findAll({
            attributes: ["userId", "date", "loginSuccess"],
        });

        res.json(loginLogs);
    } catch (error) {
        console.error('Error fetching login logs:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get the Details of User from Specific ID
router.get("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    if (!user) {
        res.status(400).json({ message: `Cannot find account with ID ${id}` })
        return;
    }
    res.json(user);
});

// Delete User Account of Specific ID
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);

    if (!user) {
        res.sendStatus(404)
        return;
    }

    let userNum = await User.destroy({
        where: { id: id }
    })

    if (userNum == 1) {
        res.json({
            message: `User ${user.name} has been deleted successfully!`
        });
    }
    else {
        res.status(400).json({
            message: `MCannnot delete ${user.name} account!`
        })
    }
});

// Update User Particulars
router.put("/updateUser/:id", validateToken, async (req, res) => {
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
        data.password = await bcrypt.hash(data.password, 10);
    }

    // Update User
    try {
        let user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ message: `User with ID ${id} not found.` });
            return;
        }

        // Update user's data directly
        Object.assign(user, data);

        // Save the updated user
        await user.save();

        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/accountRecovery", async (req, res) => {
    const { email, newPassword, confirmPassword, verificationCode } = req.body;

    // Find the user only by email WITH isDeleted false
    const user = await User.findOne({ where: { email, isDeleted: false } });

    if (!user) {
        res.status(404).json({ message: "User not found." });
        return;
    }

    // Check if the verification code matches
    if (user.verificationCode !== verificationCode) {
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
    user.password = hashedPassword;
    // user.verificationCode = null; // Reset the verification code after successful password reset

    await user.save();
    res.json({ message: "Password updated successfully." });
});

router.post("/resendVerificationCode", async (req, res) => {
    const { email, userId } = req.body;

    try {
        let user;
        if (userId) {
            // If userId is provided, it means the request is from an admin
            user = await User.findByPk(userId);
        } else {
            // Otherwise, the request is from a regular user WITH isDeleted false
            user = await User.findOne({ where: { email, isDeleted: false } });
        }

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        await user.save();

        await transporter.sendMail({
            from: process.env.BREVO_USER,
            to: user.email,
            subject: "New Verification Code Requested",
            text: `Your new verification code is: ${verificationCode}`,
        });

        res.json({ message: "Verification code sent successfully." });
    } catch (error) {
        console.error("Error resending verification code:", error);
        res.status(500).json({ message: "Failed to send verification code." });
    }
});

router.put("/requestDelete/:id", validateToken, async (req, res) => {
    const id = req.params.id;

    try {
        let user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ message: `User with ID ${id} not found.` });
            return;
        }

        user.requestDelete = true;

        // Save the updated of user
        await user.save();

        res.json({ message: "Request for account deletion has been recorded." });
    } catch (error) {
        console.error('Error updating requestDelete status:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/requestAsDriver/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    try {
        let user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: `User with ID ${id} not found.` });
            return;
        }
        user.requestAsDriver = true;
        // Save the updated status of user
        await user.save();

        res.json({ message: "Request for being a driver has been recorded." });
    } catch (error) {
        console.error('Error updating requestAsDriver status:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/setDriverStatus/:id", validateToken, async (req, res) => {
    const id = req.params.id;

    try {
        let user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({ message: `User with ID ${id} not found.` });
            return;
        }

        if (user.requestAsDriver && !user.driverStatus) {
            user.requestAsDriver = false;
            user.driverStatus = true;

            // Save the updated status of user
            await user.save();

            res.json({ message: "User has been approved as a driver." });
        } else {
            res.status(400).json({ message: "User has not requested to be a driver or is already approved." });
        }
    } catch (error) {
        console.error('Error updating requestAsDriver status:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.put("/softDelete/:id", validateToken, async (req, res) => {
    const id = req.params.id;
    try {
        let user = await User.findByPk(id);
        if (!user) {
            res.status(404).json({ message: `User with ID ${id} not found.` });
            return;
        }
        if (user.requestDelete && !user.isDeleted) {
            user.isDeleted = true;
            // Save the updated status of user
            await user.save();
            res.json({ message: "User has been DELETED and can't be used to log in." });
        } else {
            res.status(400).json({ message: "User has not requested to delete their account or is its delete status is already true." });
        }
    } catch (error) {
        console.error('Error updating isDeleted status:', error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


module.exports = router;