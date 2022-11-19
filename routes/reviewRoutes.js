const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authContoller");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authController.protect,
    reviewController.setTourUserId,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

router
  .route("/:id")
  .patch(authController.protect, reviewController.updateReview)
  .delete(authController.protect, reviewController.deleteReview);

module.exports = router;
