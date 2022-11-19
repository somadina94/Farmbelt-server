const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [],
      required: [true, "An order must have products."],
    },
    totalQuantity: {
      type: Number,
      required: [true, "An order must have a total quantity."],
    },
    totalPrice: {
      type: Number,
      required: [true, "An order must have a total price."],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Oder must belong to a user"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    address: [],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name phone",
  });
  next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
