//import
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./database");
const NotFoundHandller = require("./middleware/notFoundHandler");
const ErrorHandler = require("./middleware/errorHandler");
const passport = require("passport");
const path = require("path");
const { localStrategy, JwtStrategy } = require("./middleware/passport.js");

//import route
const usersRouter = require("./api/User/User.router.js");
const menuItemRouter = require("./api/MenuItem/MenuItem.router.js");
const customerRouter = require("./api/Customer/Customer.router.js");
const orderRouter = require("./api/Order/Order.router.js");
const route = require("./api/Whatsapp/Whatsapp.route.js");
//init
dotenv.config();
const app = express();
connectDB();
const Port = process.env.PORT;

//middleware

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use("jwt", JwtStrategy);
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

//Routes
app.use("/api/users", usersRouter);
app.use("/api/menuItem", menuItemRouter);
app.use("/api/customer", customerRouter);
app.use("/api/order", orderRouter);
app.use("/", route);
//Handler
app.use(NotFoundHandller);
app.use(ErrorHandler);
//start listen
app.listen(Port, () => {
  console.log(`Server running on ${Port}`);
});
