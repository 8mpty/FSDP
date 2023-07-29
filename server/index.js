const express = require('express');
const cors = require('cors');
const { validateToken } = require('./middlewares/auth');
const createDefaultAdmin = require('./CreateDefaultAdmin');
const { Announcement } = require('./models');
require('dotenv').config();
const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    // Fetch all announcements
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'C']],
    });

    res.json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
  res.send("FSDP Project 😎");
});

app.get("/ridehistory", validateToken, (req, res) => {
  // Extract the "isAdmin" header value from the request headers
  const isAdmin = req.headers["isadmin"] === "true";

  if (isAdmin) {
    // If user is an admin, retrieve all ride history entries
    // Your logic to get all ride history entries from the database
    // and send them as the response
    // Ensure you have imported the ridehistory model correctly
    const { ridehistory } = require('./models');
    ridehistory
      .findAll()
      .then((rideHistoryEntries) => {
        res.json(rideHistoryEntries);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } else {
    // If user is not an admin, retrieve only the user's ride history entries
    // Your logic to get ride history entries associated with the user's ID
    // from the database and send them as the response
    const { ridehistory } = require('./models');
    const userId = req.user.id;
    ridehistory
      .findAll({ where: { userId } })
      .then((rideHistoryEntries) => {
        res.json(rideHistoryEntries);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
      });
  }
});

// User Route
const userRoute = require('./routes/user');
app.use("/user", userRoute);

// Admin Route
const adminRoute = require('./routes/admin');
app.use("/admin", adminRoute);

// Ridehistory Route
const ridehistoryRoute = require("./routes/ridehistory");
app.use("/ridehistory", ridehistoryRoute);

// Bookings Route
const bookingRoute = require('./routes/booking');
app.use("/booking", bookingRoute);
const adminbookingRoute = require('./routes/adminbooking');
app.use("/adminbooking", adminbookingRoute);

// Announcement Route
const announcementRoute = require('./routes/announcements');
app.use("/announcement", announcementRoute);


// Add the following function to create a default admin when the server starts
async function initializeServer() {
  try {
    await createDefaultAdmin();
  } catch (error) {
    console.error('Error creating default admin:', error);
  }

  // Start the server after creating the default admin
  db.sequelize.sync({ alter: true }).then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
      console.log(`⚡ Sever running on http://localhost:${port}`);
    });
  });
}

// Call the initializeServer function to start the server and create the default admin
initializeServer();