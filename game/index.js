require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ================= CORS =================
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://football-manager-2.onrender.com"
  ],
  credentials: true
}));

app.use(express.json());

// ================= API ROUTES =================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/team", require("./routes/team"));
app.use("/api/league", require("./routes/league"));
app.use("/api/schedule", require("./routes/schedule"));
app.use("/api/season", require("./routes/season"));
app.use("/api/match", require("./routes/match"));
app.use("/api/player", require("./routes/player"));
app.use("/api/stadium", require("./routes/stadium")); // ✅ FIXED

// ================= FRONTEND (React Build) =================
const clientPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientPath));

// Catch-All für React Router (Express 5 kompatibel)
app.use((req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch(err => console.error("❌ MongoDB Fehler:", err));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});