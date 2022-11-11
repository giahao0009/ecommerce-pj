const express = require("express");
const router = express.Router();

// models
const Customer = require("../models/Customer");

// Middleware
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const customerId = require("../middlewares/customerId");
const formidable = require("formidable");

// @route POST api/customer/
// @desc Create customer
// @access private admin
router.post("/", auth, adminAuth, (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields) => {
    if (err) {
      return res.status(400).json({ error: "Can't create new customer !!!" });
    }
    // Check all fields
    const { cusName, cusPhone, cusMail } = fields;
    if (!cusName || !cusPhone || !cusMail) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    let customer = new Customer(fields);  
    try {
      await customer.save();
      res.json("Customer create success");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  });
});

// @router GET api/customer/all
// @desc Get all customer
// @access private admin
router.get("/all", auth, adminAuth, async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  try {
    let customers = await Customer.find({})
      .sort([[sortBy, order]])
      .exec();
    res.json(customers);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

// @router GET api/customer/:customerId
// @desc Get detail customer
// @access private admin
router.get("/:customerId", auth, adminAuth, customerId, async (req, res) => {
  res.json(req.customer);
});

// @router patch api/customer/:customerId
// @desc Update detail customer
// @access private admin
router.patch("/:customerId", auth, adminAuth, customerId, async (req, res) => {
  try {
    const id = req.params.customerId;
    const updates = req.body;
    const options = { new: true };
    const result = await Customer.findByIdAndUpdate(id, updates, options);
    res.status(200).send("Update customer success");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server is error");
  }
});

// @router delete api/customer/:customerId
// @desc delete customer
// @access private
router.delete("/:customerId", auth, adminAuth, customerId, async (req, res) => {
  let customer = req.customer;

  try {
    let deleteCustomer = await customer.remove();
    res
      .status(200)
      .json({ message: `${deleteCustomer.cusName} deleted successfully` });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server is error");
  }
});

module.exports = router;
