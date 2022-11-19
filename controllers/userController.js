const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getOneUser = catchAsync(async (req, res, next) => {
  if (!req.params.id) {
    return next();
  }
  const user = await User.findById(req.params.id).populate("orders");

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError("There is no user with that Id.", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError("Not authorized! Please use update password endpoint.", 401)
    );
  }

  const user = await User.findByIdAndUpdate(req.user._id, req.body);

  res.status(200).json({
    status: "success",
    message: "Data updated successfully!",
    data: {
      user,
    },
  });
});

exports.UpdateUser = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: {
      user: updatedUser,
    },
  });
});
