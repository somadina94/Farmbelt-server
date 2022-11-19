const { application } = require("express");
const express = require("express");
const productController = require("../controllers/productsController");
const reviewRouter = require("../routes/reviewRoutes");

const Router = express.Router();

Router.use("/:productId/reviews", reviewRouter);

Router.route("/")
  .post(productController.uploadPhotoAndPhotos, productController.createProduct)
  .get(productController.getAllProducts);

Router.route("/:id")
  .patch(
    productController.uploadPhotoAndPhotos,
    productController.updateProduct
  )
  .delete(productController.deleteProduct)
  .get(productController.getOneProduct);

module.exports = Router;
