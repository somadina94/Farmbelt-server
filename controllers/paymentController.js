const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Order = require("../models/oderModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Convert order details to a string to be passed to metaData
  const productData = JSON.stringify(req.body.products);
  const productData2 = JSON.stringify({
    totalQuantity: req.body.totalQuantity,
    totalPrice: req.body.totalPrice,
    address: req.body.address,
  });
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `https://${req.get("host")}/dashboard?success=true`,
    cancel_url: `${req.protocol}://${req.get("host")}/dashboard`,
    customer_email: req.user.email,
    client_reference_id: `${req.body.orderNum}`,
    metadata: { data: productData, data2: productData2 },
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Farmbelt Purchases`,
            images: [
              "https://somadina-test-app-bucket.s3.amazonaws.com/photo-6358362cb655b3c2e786229b-1668367986881.jpeg",
            ],
          },
          unit_amount: 100 * req.body.totalPrice,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
  });
  // 3) send checkout session
  res.status(200).json({
    status: "success",
    session,
  });
});

const createOrderCheckout = async (session) => {
  const user = (
    await User.findOne({
      email: session.customer_details.email,
    })
  )._id;
  const products = JSON.parse(session.metadata.data);
  const orderData = JSON.parse(session.metadata.data2);
  const totalPrice = orderData.totalPrice;
  const totalQuantity = orderData.totalQuantity;
  const address = orderData.address;
  await Order.create({ user, products, totalPrice, totalQuantity, address });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed")
    createOrderCheckout(event.data.object);

  res.status(200).json({ received: true });
};
