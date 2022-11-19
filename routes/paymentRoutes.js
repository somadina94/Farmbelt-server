const express = require("express");
const authController = require("../controllers/authContoller");
const paymentController = require("../controllers/paymentController");

const router = express.Router();

router
  .route("/checkout-session")
  .post(authController.protect, paymentController.getCheckoutSession);

module.exports = router;
