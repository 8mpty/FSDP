const express = require('express');
const router = express.Router();
const { Admin, AdminBooking, Sequelize } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        drivername: yup.string().trim().min(3).max(100).required(),
        driverposition: yup.string().trim().min(1).max(100).required(),
        fare: yup.string().trim().min(3).max(500).required(),
        totalearning: yup.string().trim().min(3).max(500).required()
        
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
    
    data.adminId = req.admin.id;
    let result = await AdminBooking.create(data);
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
            

        ];
    }

    let list = await AdminBooking.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
        include: { model: Admin, as: "admin", attributes: ['name'] }
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let adminbooking = await AdminBooking.findByPk(id, {
        include: { model: Admin, as: "admin", attributes: ['name'] }
    });
    // Check id not found
    if (!adminbooking) {
        res.sendStatus(404);
        return;
    }
    res.json(adminbooking);
});

router.put("/:id", validateToken, async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let adminbooking = await AdminBooking.findByPk(id);
    if (!adminbooking) {
        res.sendStatus(404);
        return;
    }

    // Check request admin id
    let adminId = req.admin.id;
    if (adminbooking.adminId != adminId) {
        res.sendStatus(403);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        drivername: yup.string().trim().min(3).max(100).required(),
        driverposition: yup.string().trim(1).min().max(500).required(),
        fare: yup.string().trim().min(3).max(500).required(),
        totalearning: yup.string().trim().min(3).max(500).required(),
        
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
    
    let num = await AdminBooking.update(data, {
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
    let adminbooking = await AdminBooking.findByPk(id);
    if (!adminbooking) {
        res.sendStatus(404);
        return;
    }

    // Check request admin id
    let adminId = req.admin.id;
    if (adminbooking.adminId != adminId) {
        res.sendStatus(403);
        return;
    }

    let num = await AdminBooking.destroy({
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