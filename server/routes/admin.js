const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Admin } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');
const { sign } = require('jsonwebtoken');
require('dotenv').config();

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
    if (admin) {
        res.status(400).json({ message: "Email already exists." });
        return;
    }

    // Hash passowrd
    data.password = await bcrypt.hash(data.password, 10);
    // Create Admin
    let result = await Admin.create(data);
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
    if(!admin){
        res.status(400).json({message: `Cannot find account with ID ${id}`})
        return;
    }
    res.json(admin);
});

// Delete Admin Account of Specific ID
router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    let admin = await Admin.findByPk(id);

    if (!admin){
        res.sendStatus(404)
        return;
    }

    let adminNum = await Admin.destroy({
        where: { id: id }
    })

    if(adminNum == 1){
        res.json({
            message: `Admin ${admin.name} has been deleted successfully!`
        });
    }
    else{
        res.status(400).json({
            message: `MCannnot delete ${admin.name} account!`
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




module.exports = router;