const express = require('express');
const cors = require('cors');
const { validateToken } = require('./middlewares/auth');
const createDefaultAdmin = require('./CreateDefaultAdmin');
const { Sequelize, Announcement } = require('./models');
require('dotenv').config();
const cron = require('node-cron');
const db = require('./models');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const deleteExpiredAnnouncements = async () => {
  const currentDate = new Date();
  try {
    await Announcement.destroy({
      where: {
        endDate: {
          [Sequelize.Op.lte]: currentDate
        }
      }
    });
  } catch (err) {
    console.error('Error deleting expired announcements:', err);
  }
};
app.use(async (req, res, next) => {
  try {
    if (req.originalUrl === '/announcement') {
      await deleteExpiredAnnouncements();
    }
    next();
  } catch (err) {
    console.error('Error while handling announcement route:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Will Run the deleteExpiredAnnouncements function every day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
  await deleteExpiredAnnouncements();
});

app.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.findAll({
      order: [['createdAt', 'DESC']],
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
const fileRoute = require('./routes/file');
app.use("/file", fileRoute);

// Admin Route
const adminRoute = require('./routes/admin');
app.use("/admin", adminRoute);

// Ridehistory Route
const ridehistoryRoute = require("./routes/ridehistory");
app.use("/ridehistory", ridehistoryRoute);

// Bookings Route
const bookingRoute = require('./routes/booking');
app.use("/booking", bookingRoute);
const driverbookingRoute = require('./routes/driverbooking');
app.use("/driverbooking", driverbookingRoute);

// Announcement Route
const announcementRoute = require('./routes/announcements');
app.use("/announcement", announcementRoute);

// Rewards Route
const rewardsRoute = require('./routes/rewards');
app.use("/rewards", rewardsRoute);

// Add the following function to create a default admin when the server starts
async function initializeServer() {
  try {
    await db.sequelize.sync();
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
    setInterval(deleteExpiredAnnouncements, 24 * 60 * 60 * 1000); // 24 hours
    deleteExpiredAnnouncements();
  });
}

// Call the initializeServer function to start the server and create the default admin
initializeServer();

