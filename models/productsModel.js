const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "A product must have a name"],
    },
    price: {
      type: Number,
      required: [true, "Please enter the price of your product"],
    },
    description: String,
    photo: String,
    photos: [String],
    ratingsAverage: {
      type: Number,
      default: 4.4,
      min: 1,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Vitual populate
productsSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

const Product = mongoose.model("Product", productsSchema);

module.exports = Product;
