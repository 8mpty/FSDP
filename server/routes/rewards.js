const express = require('express');
const router = express.Router();
//const { Rewards } = require('../models');
const { Rewards, Sequelize } = require('../models');
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body  - error roughly around here
    let validationSchema = yup.object().shape({
        Reward_Name: yup.string().trim().min(3).max(100).nullable().required(),
        Points_Required: yup.number().integer().min(3).max(10000).nullable().required(),
        Reward_Amount: yup.number().integer().min(3).max(1000).nullable().required()
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false });  //remove strict true 
    }
    //next time any error can try: Console Log
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    data.Reward_Name = data.Reward_Name.trim();
    data.Points_Required = data.Points_Required;
    data.Reward_Amount = data.Reward_Amount;
    let result = await Rewards.create(data);
    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { Reward_Name: { [Sequelize.Op.like]: `%${search}%` } },
            { Points_Required: { [Sequelize.Op.like]: `%${search}%` } },
            { Reward_Amount: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await Rewards.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let rewards = await Rewards.findByPk(id);
    // Check id not found
    if (!rewards) {
        res.sendStatus(404);
        return;
    }
    res.json(rewards);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    
    let rewards = await Rewards.findByPk(id);
    if (!rewards) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    data.Reward_Amount = parseInt(data.Reward_Amount);
    data.Points_Required = parseInt(data.Points_Required);
    // Validate request body
    let validationSchema = yup.object().shape({
        Reward_Name: yup.string().trim().min(3).max(100).required(),
        Points_Required: yup.number().integer().min(3).max(10000).required(),
        Reward_Amount: yup.number().integer().min(3).max(1000).required(),
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    data.Reward_Name = data.Reward_Name.trim();
    data.Points_Required = data.Points_Required;
    data.Reward_Amount = data.Reward_Amount;
    let num = await Rewards.update(data, {
        where: { id: id }
    });
    if (num == 1) {
        res.json({
            message: "Rewards was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update Rewards with id ${id}.`
        });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await Rewards.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Rewards was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Rewards with id ${id}.`
        });
    }
});

module.exports = router

