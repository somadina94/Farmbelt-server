const Order = require("../models/oderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.setUser = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const order = await Order.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Order successfully created!",
    data: {
      order,
    },
  });
});

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    status: "success",
    data: {
      orders,
    },
  });
});

exports.updateOder = catchAsync(async (req, res, next) => {
  const updatedOder = await Order.findByIdAndUpdate(req.params.id, req.body);

  if (!updatedOder) {
    return next(new AppError("Order does not exist!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Order successfully updated!",
    data: {
      order: updatedOder,
    },
  });
});

exports.getOneOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError("Order was not found", 401));
  }

  res.status(200).json({
    status: "success",
    data: {
      order,
    },
  });
});

exports.deleteOder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError("Oder was not found", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
