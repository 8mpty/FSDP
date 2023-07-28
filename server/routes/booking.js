const express = require('express');
const router = express.Router();
const { User, Booking, Sequelize } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        name: yup.string().trim().min(3).max(100).required(),
        pickup: yup.string().trim().min(3).max(500).required(),
        notes: yup.string().trim().min(3).max(500).required(),
        passby: yup.string().trim().min(3).max(500).required()
        
    });
    try {
        await validationSchema.validate(data, { abortEarly: false });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.name = data.name.trim();
    data.pickup = data.pickup.trim();
    data.passby = data.passby.trim();
    data.notes = data.notes.trim();
    
    data.userId = req.user.id;
    let result = await Booking.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { name: { [Sequelize.Op.like]: `%${search}%` } },
            { pickup: { [Sequelize.Op.like]: `%${search}%` } },
            { passby: { [Sequelize.Op.like]: `%${search}%` } },
            { notes: { [Sequelize.Op.like]: `%${search}%` } },
            

        ];
    }

    let list = await Booking.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let booking = await Booking.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });
    // Check id not found
    if (!booking) {
        res.sendStatus(404);
        return;
    }
    res.json(booking);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let booking = await Booking.findByPk(id);
    if (!booking) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (booking.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        name: yup.string().trim().min(3).max(100).required(),
        pickup: yup.string().trim().min(3).max(500).required(),
        passby: yup.string().trim().min(3).max(500).required(),
        notes: yup.string().trim().min(3).max(500).required(),
        
    });
    try {
        await validationSchema.validate(data, { abortEarly: false });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.name = data.name.trim();
    data.pickup = data.pickup.trim();
    data.passby = data.passby.trim();
    data.notes = data.notes.trim();
    
    let num = await Booking.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Booking was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update booking with id ${id}.`
        });
    }
});

router.delete("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let booking = await Booking.findByPk(id);
    if (!booking) {
        res.sendStatus(404);
        return;
    }

    // Check request user id
    let userId = req.user.id;
    if (booking.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await Booking.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Booking was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete booking with id ${id}.`
        });
    }
});

module.exports = router;