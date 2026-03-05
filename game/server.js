require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

/* ================= ROUTES ================= */

const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const playerRoutes = require("./routes/player");
const managerRoutes = require("./routes/manager");
const matchRoutes = require("./routes/match");
const leagueRoutes = require("./routes/league");
const newsRoutes = require("./routes/news");
const transferRoutes = require("./routes/transfer");


/* ================= SYSTEM ================= */

const { initializeSeason } = require("./utils/seasonInitializer");
const { startScheduler } = require("./utils/scheduler");

/* ================= APP ================= */

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* ================= API ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/league", leagueRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/transfer", transferRoutes);

/* ================= FRONTEND BUILD ================= */

const clientBuildPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientBuildPath));

app.use((req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

/* ================= DATABASE ================= */

async function startServer() {

try {

await mongoose.connect(process.env.MONGO_URI);

console.log("MongoDB verbunden");

/* ================= SEASON INIT ================= */

await initializeSeason();

/* ================= SCHEDULER ================= */

startScheduler();

console.log("Scheduler gestartet");

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

console.log("Server läuft auf Port", PORT);

});

} catch (err) {

console.error("Server Start Fehler:", err);

}

}

startServer();