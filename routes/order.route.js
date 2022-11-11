const express = require("express");
const router = express.Router();

// Models
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Middleware
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const customerId = require("../middlewares/customerId");
const formidable = require("formidable");
const { castObject } = require("../models/Order");

// @route POST api/order/
// @desc Create order
// @access private admin
router.post("/", auth, adminAuth, async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields) => {
    if (err) {
      return res.status(400).json({ error: "Can't create new order", err });
    }
    //Check all fields
    const { IDCus, addressDelivery, orderDetail } = fields;
    if (!IDCus || !addressDelivery || !orderDetail) {
      return res.status(400).json({ error: "All fields is required" });
    }
    if ((orderDetail = [])) {
      return res.status(400).json({ error: "Please fill order detail" });
    }
    for (let i = 0; i < orderDetail.length; ++i) {
      try {
        let product = await Product.findById(orderDetail[i].productId);
        if (!product) {
          return res.status(400).json({ error: "Cant not found product" });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).send("Server is error");
      }
    }
    let amount = orderDetail.reduce((total, item) => {
      let price = item.unitPrice + item.quantity;
      return total + price;
    });
    let order = new Order({ ...fields, amount });
    try {
      await order.save();
      res.status(200).json("Order create success");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server is error");
    }
  });
});

// @route GET api/order/all
// @desc Get all order
// @access private admin
router.get("/all", auth, admin);
module.exports = router;
