const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("Testing");
});


let port = process.env.APP_PORT;
app.listen(port, () => {
    console.log(`⚡ Sever running on http://localhost:${port}`);
});
