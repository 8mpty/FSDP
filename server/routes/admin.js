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



module.exports = router;