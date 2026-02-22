require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const clubRoutes = require("./routes/clubRoutes");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/clubs", clubRoutes);

/* ================= MONGODB ================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB verbunden");
  })
  .catch(err => {
    console.error("MongoDB Fehler:", err);
  });

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});