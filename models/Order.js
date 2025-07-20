const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const orderSchema = new Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: Number,
  status: {
    type: String,
    enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
    default: "pending",
  },
  channel: { type: String, enum: ["whatsapp", "web"], default: "whatsapp" },
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Order", orderSchema);
