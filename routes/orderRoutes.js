const express = require("express");
const orderController = require("../controllers/orderController");
const authController = require("../controllers/authContoller");

const router = express.Router();

router.use(authController.protect);

router
  .route("/")
  .get(orderController.getAllOrders)
  .post(orderController.setUser, orderController.createOrder);

router
  .route("/:id")
  .get(orderController.getOneOrder)
  .delete(orderController.deleteOder);

module.exports = router;
