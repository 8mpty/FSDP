const express = require("express");
const router = express.Router();
const { User, ridehistory, Sequelize } = require("../models");
const yup = require("yup");
const { validateToken } = require("../middlewares/auth");


router.post("/completeride/:rideId", async (req, res) => {
  const { rideId } = req.params;
  
  try {
      // Find the ride with the given ID
      const ride = await ridehistory.findByPk(rideId);

      if (!ride) {
          return res.status(404).json({ message: "Ride not found" });
      }

      if (ride.status !== "completed") {
          return res.status(400).json({ message: "Ride is not completed" });
      }

      // Create ride history entry for rider
      const riderHistory = {
          userId: ride.riderId,
          bookingId: ride.bookingId,
          description: `Completed ride from ${ride.start} to ${ride.end}`,
          points: ride.points,
          totalPoints: ride.totalPoints,
      };
      await RideHistory.create(riderHistory);

      // Create ride history entry for driver
      const driverHistory = {
          userId: ride.driverId,
          bookingId: ride.bookingId,
          description: `Completed ride from ${ride.start} to ${ride.end}`,
          points: ride.points,
          totalPoints: ride.totalPoints,
      };
      await RideHistory.create(driverHistory);

      return res.status(201).json({ message: "Ride history entries created" });
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