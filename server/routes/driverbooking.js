const express = require('express');
const router = express.Router();
const { User, DriverBooking, Sequelize } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        drivername: yup.string().trim().min(3).max(100).required(),
        driverposition: yup.string().trim().min(1).max(100).required(),
        fare: yup.string().trim().min(3).max(500).required(),
        totalearning: yup.string().trim().min(3).max(500).required(),
        status: yup.string().trim().min(3).max(500).required(),
        destination: yup.string().trim().min(3).max(100).required(),
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

    data.drivername = data.drivername.trim();
    data.driverposition = data.driverposition.trim();
    data.fare = data.fare.trim();
    data.totalearning = data.totalearning.trim();
    data.status = data.status.trim();
    data.destination = data.destination.trim();
    data.pickup = data.pickup.trim();
    data.passby = data.passby.trim();
    data.notes = data.notes.trim();
    
    data.userId = req.user.id;
    let result = await DriverBooking.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { drivername: { [Sequelize.Op.like]: `%${search}%` } },
            { driverposition: { [Sequelize.Op.like]: `%${search}%` } },
            { fare: { [Sequelize.Op.like]: `%${search}%` } },
            { totalearning: { [Sequelize.Op.like]: `%${search}%` } },
            { status: { [Sequelize.Op.like]: `%${search}%` } },
            { destination: { [Sequelize.Op.like]: `%${search}%` } },
            { pickup: { [Sequelize.Op.like]: `%${search}%` } },
            { passby: { [Sequelize.Op.like]: `%${search}%` } },
            { notes: { [Sequelize.Op.like]: `%${search}%` } },
            

        ];
    }

    let list = await DriverBooking.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "user", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let driverbooking = await DriverBooking.findByPk(id, {
        include: { model: User, as: "user", attributes: ['name'] }
    });
    // Check id not found
    if (!driverbooking) {
        res.sendStatus(404);
        return;
    }
    res.json(driverbooking);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let driverbooking = await DriverBooking.findByPk(id);
    if (!driverbooking) {
        res.sendStatus(404);
        return;
    }

    // Check request admin id
    let userId = req.user.id;
    if (driverbooking.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        drivername: yup.string().trim().min(3).max(100).required(),
        driverposition: yup.string().trim().min(1).max(500).required(),
        fare: yup.string().trim().min(3).max(500).required(),
        totalearning: yup.string().trim().min(3).max(500).required(),
        status: yup.string().trim().min(3).max(500).required(),
        destination: yup.string().trim().min(3).max(100).required(),
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

    data.drivername = data.drivername.trim();
    data.driverposition = data.driverposition.trim();
    data.fare = data.fare.trim();
    data.totalearning = data.totalearning.trim();
    data.status = data.status.trim();
    data.destination = data.destination.trim();
    data.pickup = data.pickup.trim();
    data.passby = data.passby.trim();
    data.notes = data.notes.trim();
    
    let num = await DriverBooking.update(data, {
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
    let driverbooking = await DriverBooking.findByPk(id);
    if (!driverbooking) {
        res.sendStatus(404);
        return;
    }

    // Check request admin id
    let userId = req.user.id;
    if (driverbooking.userId != userId) {
        res.sendStatus(403);
        return;
    }

    let num = await DriverBooking.destroy({
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