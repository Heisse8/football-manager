require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

// API ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/team", require("./routes/team"));
app.use("/api/league", require("./routes/league"));
app.use("/api/schedule", require("./routes/schedule"));
app.use("/api/season", require("./routes/season"));
app.use("/api/match", require("./routes/match"));

// 🔥 WICHTIG: client/dist (nicht game/dist!)
const clientPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientPath));

app.get("/*", (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch(err => console.error("❌ MongoDB Fehler:", err));

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});