const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/productsRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const paymentController = require("./controllers/paymentController");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const helmet = require("helmet");
const path = require("path");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");
// const enforce = require("express-sslify");

const app = express();

// app.use(enforce.HTTPS());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  })
);

app.use(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  paymentController.webhookCheckout
);

// Limit requests from same IP
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this ip address, try again in 1hour.",
});
app.use("/api", limiter);

app.use(express.json());

app.use(cors());

// Data sanitization against NOSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(compression());

// Serving static files
app.use(express.static(path.join(__dirname, "/build")));

app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/users", userRouter);

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "/build", "index.html"));
});

// Handing error for routes not found on the server
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
