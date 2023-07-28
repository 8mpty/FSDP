const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("FSDP Project 😎");
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


const db = require('./models');
db.sequelize.sync({ alter: true }).then(() => {
    let port = process.env.APP_PORT;
    app.listen(port, () => {
        console.log(`⚡ Sever running on http://localhost:${port}`);
    });
})