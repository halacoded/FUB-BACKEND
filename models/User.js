const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  businessType: {
    type: String,
    enum: ["home-kitchen", "restaurant", "cloud"],
    default: "home-kitchen",
  },
  logoUrl: String,
  location: String,
  specialties: [String],
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
module.exports = model("User", UserSchema);
