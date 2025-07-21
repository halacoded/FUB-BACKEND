const express = require("express");
const router = express.Router();
const { handleIncomingMessage } = require("./Whatsapp.controller");

router.post("/webhook", handleIncomingMessage);
router.get("/webhook", (req, res) => {
  res.send("Webhook is alive 🟢");
});

module.exports = router;
