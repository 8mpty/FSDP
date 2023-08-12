const express = require("express");
const router = express.Router();
const { User, ridehistory, Sequelize } = require("../models");
const yup = require("yup");
const { validateToken } = require("../middlewares/auth");
const axios = require("axios");

router.post("/", validateToken, async (req, res) => {
  try {
    // Get the authenticated user's ID from the request
    const userId = req.user.id;

    // Find the ride with the given ID from the request body
    const data = req.body;

    if (!data) {
      return res.status(404).json({ message: "Ride not found" });
    }

    const bookingResponse = await axios.get(
      `http://localhost:3001/booking/${data.bookingId}`
    );
    const bookingData = bookingResponse.data;

    const riderId = bookingData.userId;

    const driverbookingResponse = await axios.get(
      `http://localhost:3001/driverbooking/${data.driverbookingId}`
    );
    const driverbookingData = driverbookingResponse.data;

    const driverId = driverbookingData.userId;

    const existingRideHistory = await ridehistory.findOne({
      where: {
        userId: userId,
        bookingId: data.bookingId, // Assuming you have this data in the request body
      },
    });

    if (existingRideHistory) {
      return res
        .status(400)
        .json({ message: "Ride history entry already exists" });
    }

    // Create ride history entry for rider
    try {
      const points = 100;

      // Calculate totalPoints by adding points to the user's current totalPoints
      const totalPoints = ridehistory.totalPoints + 100;

      const newRideHistoryData = {
        userId: userId,
        bookingId: data.bookingId, // Make sure you have this data in the request body
        description: "", // Set the description as needed
        points: points,
        totalPoints: points + points,
        driverId: driverId,
        riderId: riderId,
      };

      // Create the new ride history entry
      await ridehistory.create(newRideHistoryData);

      return res.status(201).json({ message: "Ride history entries created" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error creating ride history entries" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating ride history entries" });
  }
});

router.get("/", validateToken, async (req, res) => {
  let condition = {};
  let search = req.query.search;

  if (search) {
    condition[Sequelize.Op.or] = [
      { driver: { [Sequelize.Op.like]: `%${search}%` } },
      { rider: { [Sequelize.Op.like]: `%${search}%` } },
    ];
  }

  // Check if the authenticated user is an admin
  const isAdmin = req.user.isAdmin;

  if (!isAdmin) {
    // If it's not an admin, apply the filtering by user id
    condition.userId = req.user.id;
  }

  try {
    let list = await ridehistory.findAll({
      order: [["createdAt", "DESC"]],
      where: condition,
      include: { model: User, as: "user", attributes: ["name"] },
    });
    res.json(list);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching ride history" });
  }
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
