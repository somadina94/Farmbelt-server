const Product = require("../models/productsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const multer = require("multer");
const sharp = require("sharp");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3-transform");

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3,
    // bucket: process.env.AWS_BUCKET_NAME_S3,
    bucket: "somadina-test-app-bucket",
    shouldTransform: function (req, file, cb) {
      cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        key: function (req, file, cb) {
          cb(null, `${file.fieldname}-${Date.now()}.jpeg`);
        },
        transform: function (req, file, cb) {
          if (file.fieldname === "photo") {
            cb(null, sharp().jpeg({ quality: 50 }).withMetadata());
          } else {
            cb(null, sharp().jpeg({ quality: 50 }).withMetadata());
          }
        },
      },
    ],
  }),
});

exports.uploadPhotoAndPhotos = upload.fields([
  { name: "photo", maxCount: 1 },
  { name: "photos", maxCount: 5 },
]);

exports.createProduct = catchAsync(async (req, res, next) => {
  if (req.files.photo) {
    req.files.photo.forEach((el) => {
      const [photo] = el.transforms;
      req.body.photo = photo.location;
    });
  }

  if (req.files.photos) {
    req.body.photos = [];
    req.files.photos.forEach((el) => {
      const [photos] = el.transforms;
      req.body.photos.push(photos.location);
    });
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Product successfully created.",
    data: {
      product,
    },
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: "sucess",
    data: {
      products,
    },
  });
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("reviews");

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  if (req.files.photo) {
    req.files.photo.forEach((el) => {
      const [photo] = el.transforms;
      req.body.photo = photo.location;
    });
  }

  if (req.files.photos) {
    req.body.photos = [];
    req.files.photos.forEach((el) => {
      const [photos] = el.transforms;
      req.body.photos.push(photos.location);
    });
  }

  const product = await Product.findByIdAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) {
    return next(new AppError("No product found with that Id", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product updated successfully!",
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete({ _id: req.params.id });

  if (!product) {
    return next(new AppError("No product found with that Id.", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
