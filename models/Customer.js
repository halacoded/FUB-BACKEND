const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const customerSchema = new Schema({
  phone: { type: String, required: true, unique: true },
  preferredLanguage: { type: String, default: "ar" },
  accessibilityPrefs: {
    voiceOrdering: { type: Boolean, default: false },
    simplifiedMenu: { type: Boolean, default: false },
  },
  lastOrderAt: Date,
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("Customer", customerSchema);
