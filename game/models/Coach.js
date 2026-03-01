import mongoose from "mongoose";

const coachSchema = new mongoose.Schema({

  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Club",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  age: {
    type: Number,
    required: true
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    required: true
  },

  preferredFormation: {
    type: String,
    required: true
  },

  playstyle: {
    type: String,
    enum: ["Ballbesitz", "Kontern", "Gegenpressing", "Mauern"],
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Coach", coachSchema);