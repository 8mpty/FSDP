const express = require('express');
const cors = require('cors');
const { validateToken } = require('./middlewares/auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
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


const db = require('./models');
db.sequelize.sync({ alter: true }).then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`⚡ Sever running on http://localhost:${port}`);
    });
})