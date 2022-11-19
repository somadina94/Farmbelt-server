const express = require("express");
const authController = require("../controllers/authContoller");
const userController = require("../controllers/userController");

const Router = express.Router();

Router.post("/signUp", authController.signup);
Router.post("/login", authController.login);
Router.post("/logout", authController.logout);
Router.post("/forgotPassword", authController.forgotPassword);
Router.patch("/resetPassword/:token", authController.resetPassword);
Router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

Router.patch("/updateMe", authController.protect, userController.updateMe);

Router.get("/", userController.getAllUsers);

Router.route("/me").get(
  authController.protect,
  userController.getMe,
  userController.getOneUser
);

Router.route("/:id")
  .get(userController.getOneUser)
  .delete(userController.deleteUser)
  .patch(userController.UpdateUser);

module.exports = Router;
