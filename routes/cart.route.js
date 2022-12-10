const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Models
const User = require("../models/User");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Middleware
const auth = require("../middlewares/auth");

// @route put api/cart/:userid
// @desc delete 1 item from cart
// @access private user
router.put("/remove/:idItem", auth, async (req, res) => {
  const userId = req.user.id;
  const idItem = req.params.idItem;
  try {
    let user = await User.findOne({ _id: userId });
    user.cart = user.cart.filter((value, index) => {
      return value._id != idItem;
    });
    await user.save();
    res.status(200).send("Remove successfully");
  } catch (err) {
    res.status(500).send("Server is error");
  }
});

// @route POST api/cart/payment
// @desc post payment
router.post("/payment", auth, async (req, res) => {
  const userId = req.user.id;
  const { addressDelivery, cusName, cusPhone, orderDetail, paymentMethod } =
    req.body;
  console.log(addressDelivery, cusName, cusPhone, orderDetail, paymentMethod);
  if (!addressDelivery || !orderDetail) {
    res.status(402).send("Please fill all info of order");
  }

  try {
    let user = await User.findOne({ _id: userId });
    let totalPrice = 0;
    for (let i = 0; i < orderDetail.length; i++) {
      totalPrice += orderDetail[i].unitPrice * orderDetail[i].quantity;
    }
    console.log(totalPrice);
    let order = new Order();
    order.IDCus = userId;
    order.amount = totalPrice;
    order.addressDelivery = addressDelivery;
    order.cusName = cusName;
    order.cusPhone = cusPhone;
    order.orderDetail = orderDetail;
    if (paymentMethod === "Paypal") {
      order.paymentMethod = "Paypal";
      order.status = 2;
    }

    await order.save();
    console.log(order);
    user.cart = [];
    await user.save();
    res.status(200).send("Payment successfully");
  } catch (err) {
    res.status(500).send("Server is error");
  }
});

// @route POST api/cart/
// @desc get cart of user
// @access private user
router.put("/", auth, async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(403).json({ error: "Customer not found" });
  }
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(403).json({ error: "Product not found" });
  }
  try {
    let product = await Product.findOne({ _id: productId }).select("-photo");
    console.log(product);
    if (product.quantity < quantity) {
      return res.status(405).json({ error: "Exceed the quantity in stock" });
    }

    // Add cart of user
    let user = await User.findOne({ _id: userId });
    let cartItem = {
      productId: productId,
      quantity: quantity,
      unitPrice: product.price,
      productName: product.name,
    };
    user.cart.push(cartItem);
    await user.save();
    console.log(user);
    return res.status(200).json("Add product to cart successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server is error");
  }
});

// @route GET api/cart/:userid
// @desc get cart of user
// @access private user
router.get("/", auth, async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(403).json({ error: "Customer not found" });
  }
  try {
    let user = await User.findOne({ _id: userId });
    return res.status(200).json(user.cart);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server is error");
  }
});

module.exports = router;
