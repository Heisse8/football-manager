require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ===============================
// CORS (nur lokal nötig)
// ===============================
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

// ===============================
// API ROUTES
// ===============================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/team", require("./routes/team"));
app.use("/api/league", require("./routes/league"));
app.use("/api/schedule", require("./routes/schedule"));
app.use("/api/season", require("./routes/season"));
app.use("/api/match", require("./routes/match"));

// ===============================
// FRONTEND STATIC SERVE
// ===============================

// React Build Ordner
app.use(express.static(path.join(__dirname, "../client/dist")));

// Express 5 kompatibler Catch-All
app.use((req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/dist/index.html")
  );
});

// ===============================
// DATABASE CONNECT
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch(err => console.error("❌ MongoDB Fehler:", err));

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});