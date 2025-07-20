const express = require("express");
const customerRouter = express.Router();
const {
  createOrUpdateCustomer,
  getCustomerByPhone,
} = require("./Customer.controller");

customerRouter.post("/", createOrUpdateCustomer);
customerRouter.get("/:phone", getCustomerByPhone);

module.exports = customerRouter;
//TESTED ALL ROUTE WORKS
