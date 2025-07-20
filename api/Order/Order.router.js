const express = require("express");
const orderRouter = express.Router();
const passport = require("passport");
const {
  createOrder,
  getOrdersByRestaurant,
  updateOrderStatus,
} = require("./Order.controller");

const authenticate = passport.authenticate("jwt", { session: false });

orderRouter.post("/", createOrder);
orderRouter.get("/", authenticate, getOrdersByRestaurant);
orderRouter.put("/:id/status", authenticate, updateOrderStatus);

module.exports = orderRouter;
//TESTED ALL ROUTE WORKS
