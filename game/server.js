const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const teamRoutes = require("./routes/team");
const matchRoutes = require("./routes/match");
const playerRoutes = require("./routes/player");
const seasonRoutes = require("./routes/season");

// Cronjob laden (wichtig!)
require("./cron/matchCron");

const app = express();

// ================= Middleware =================
app.use(cors());
app.use(express.json());

// ================= Routes =================
app.use("/api/team", teamRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/season", seasonRoutes);
app.use("/api/news", require("./routes/news"));

// ================= MongoDB =================
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB verbunden");
})
.catch(err => {
    console.error("MongoDB Fehler:", err);
});

// ================= Server Start =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});