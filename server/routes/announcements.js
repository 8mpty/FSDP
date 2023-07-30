const express = require('express');
const router = express.Router();
const { Admin, Announcement, Sequelize } = require('../models');
const { validateToken } = require('../middlewares/auth');
const yup = require("yup");



router.post("/createAnnouncement", validateToken, async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object({
        title: yup.string().trim().min(5).max(50).required(),
        description: yup.string().trim().min(10).max(100).required(),
        endDate: yup.date().nullable(),
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    data.title = data.title.trim();
    data.description = data.description.trim();
    data.adminId = req.admin.id;

    if (data.endDate) {
        data.endDate = new Date(data.endDate);
    } else {
        // For testing purposes, set endDate to yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        data.endDate = yesterday;
    }


    let result = await Announcement.create(data);
    res.json(result);
});

router.get("/getAllAnnouncements", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { title: { [Sequelize.Op.like]: `%${search}%` } },
            { description: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }
    let list = await Announcement.findAll({
        where: condition,
        order: [['createdAt', 'ASC']],
        include: { model: Admin, as: "admin", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let announcement = await Announcement.findByPk(id, {
        include: { model: Admin, as: "admin", attributes: ['name'] }
    });
    // Check id not found
    if (!announcement) {
        res.sendStatus(404);
        return;
    }
    res.json(announcement);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let announcement = await Announcement.findByPk(id);
    if (!announcement) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().min(5).max(50).required(),
        description: yup.string().trim().min(10).max(100).required(),
        endDate: yup.date().nullable(),
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    data.title = data.title.trim();
    data.description = data.description.trim();
    let num = await Announcement.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Announcement was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update announcement with id ${id}.`
        });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let announcement = await Announcement.findByPk(id);
    if (!announcement) {
        res.sendStatus(404);
        return;
    }
    let num = await Announcement.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Announcement was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete announcement with id ${id}.`
        });
    }
});

module.exports = router;