const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/* ===== API ROUTES ===== */
app.use("/api/auth", require("./routes/auth"));   // ✅ FEHLTE
app.use("/api/team", require("./routes/team"));
app.use("/api/match", require("./routes/match"));
app.use("/api/player", require("./routes/player"));
app.use("/api/season", require("./routes/season"));
app.use("/api/news", require("./routes/news"));
app.use("/api/manager", require("./routes/manager"));

/* ===== React Build ===== */
app.use(express.static(path.join(__dirname, "../client/dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB verbunden"))
  .catch(err => console.error("MongoDB Fehler:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});