const express = require("express");
const usersRouter = express.Router();
const {
  signup,
  login,
  getProfile,
  updateProfile,
} = require("./User.controller");
const passport = require("passport");
const upload = require("../../middleware/multer");

const authenticate = passport.authenticate("jwt", { session: false });

// Authentication routes
usersRouter.post("/signup", signup);
usersRouter.post(
  "/login",
  passport.authenticate("local", { session: false }),
  login
);
usersRouter.get("/profile", authenticate, getProfile);
usersRouter.put("/profile", authenticate, updateProfile);

module.exports = usersRouter;

//TESTED ALL ROUTE WORKS
