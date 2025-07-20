const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const menuItemSchema = new Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  available: { type: Boolean, default: true },
  imageUrl: String,
  voiceLabel: String, // For audio-accessible orders
  tags: [String],
});

module.exports = model("MenuItem", menuItemSchema);
