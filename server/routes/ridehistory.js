const express = require("express");
const router = express.Router();
const { User, ridehistory, Sequelize } = require("../models");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/",validateToken, async (req, res) => {
  let data = req.body;
  // Validate request body
  let validationSchema = yup.object().shape({
    driver: yup.string().trim().min(3).max(100).required(),
    description: yup.string().trim().max(50),
    start: yup.string().trim().min(3).max(40).required(),
    end: yup.string().trim().min(3).max(40).required(),
  });
  try {
    await validationSchema.validate(data, { abortEarly: false, strict: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errors: err.errors });
    return;
  }
  data.userId = user.id;
  let result = await ridehistory.create(data);
  
  res.json(result);
});

router.get("/", async (req, res) => {

  let condition = {};
  let search = req.query.search;
  if (search) {
    condition[Sequelize.Op.or] = [
      { driver: { [Sequelize.Op.like]: `%${search}%` } },
      { rider: { [Sequelize.Op.like]: `%${search}%` } },
    ];
  }

  condition.userId = req.user.id;

  let list = await ridehistory.findAll({
    order: [["createdAt", "DESC"]],
    where: condition,
    include: { model: User, as: "user", attributes: ['name'] }
  });
  res.json(list);
});

router.get("/:id", async (req, res) => {
  let id = req.params.id;
  let Ridehistory = await ridehistory.findByPk(id);

  // Check if ride history is not found
  if (!Ridehistory) {
    res.sendStatus(404);
    return;
  }

  res.json(Ridehistory);
});

router.put("/:id", async (req, res) => {
  let id = req.params.id;
  // Check id not found
  let Ridehistory = await ridehistory.findByPk(id);
  if (!Ridehistory) {
    res.sendStatus(404);
    return;
  }
  let data = req.body;
  let num = await ridehistory.update(data, {
    where: { id: id },
  });

  // Validate request body
  let validationSchema = yup.object().shape({
    description: yup.string().trim().max(500),
  });
  try {
    await validationSchema.validate(data, { abortEarly: false, strict: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errors: err.errors });
    return;
  }

  if (num == 1) {
    res.json({
      message: "Description was updated successfully.",
    });
  } else {
    res.status(400).json({
      message: `Cannot update description with id ${id}.`,
    });
  }
});

router.delete("/:id", async (req, res) => {
  let id = req.params.id;
  let num = await ridehistory.destroy({
    where: { id: id },
  });
  if (num == 1) {
    res.json({
      message: "Ride History was deleted successfully.",
    });
  } else {
    res.status(400).json({
      message: `Cannot delete Ride History with id ${id}.`,
    });
  }
});

module.exports = router;
