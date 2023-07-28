const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');
const { sign } = require('jsonwebtoken');
require('dotenv').config();

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
    if (user) {
        res.status(400).json({ message: "Email already exists." });
        return;
    }

    // Hash passowrd
    data.password = await bcrypt.hash(data.password, 10);
    // Create User
    let result = await User.create(data);
    res.json(result);
});

// Login User
router.post("/login", async (req, res) => {
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
    let user = await User.findOne({
        where: { email: data.email }
    });
    if (!user) {
        res.status(400).json({ message: errorMsg });
        return;
    }
    let match = await bcrypt.compare(data.password, user.password);
    if (!match) {
        res.status(400).json({ message: errorMsg });
        return;
    }

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
        data.password = await bcrypt.hash(data.password, 10); // Hash the new password
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

module.exports = router;