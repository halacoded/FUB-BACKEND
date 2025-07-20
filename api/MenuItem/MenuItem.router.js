const express = require("express");
const menuItemRouter = express.Router();
const {
  createMenuItem,
  getMyMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("./MenuItem.controller");
const passport = require("passport");
const upload = require("../../middleware/multer");
const authenticate = passport.authenticate("jwt", { session: false });

menuItemRouter.post("/", authenticate, upload.single("image"), createMenuItem);
menuItemRouter.get("/", authenticate, getMyMenuItems);
menuItemRouter.put(
  "/:id",
  authenticate,
  upload.single("image"),
  updateMenuItem
);
menuItemRouter.delete("/:id", authenticate, deleteMenuItem);

module.exports = menuItemRouter;

//TESTED ALL ROUTE WORKS
