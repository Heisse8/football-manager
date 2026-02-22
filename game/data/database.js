const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://gameadmin:G9bp16PO5SV2d0lr@cluster0.mgzqh3f.mongodb.net/fussballmanager?retryWrites=true&w=majority"
    );

    console.log("MongoDB Atlas verbunden 🔥");
  } catch (err) {
    console.error("MongoDB Fehler:", err);
  }
}

module.exports = { connectDB };