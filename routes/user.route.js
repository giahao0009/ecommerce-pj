const express = require("express");
const router = express.Router();

// models
const User = require("../models/User");

// Middleware
const auth = require("../middlewares/auth");
const authAdmin = require("../middlewares/adminAuth");

// @route GET api/users/all
// @desc get all user account
// @access private admin
router.get("/all", auth, authAdmin, async (req, res) => {
  try {
    let users = await User.find({}).select("-password").exec();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.send("Server is error");
  }
});

// @route GET api/users/:id
// @desc get detail user
// @access private admin
router.get("/:id", auth, authAdmin, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    res.json(user);
  } catch (err) {
    console.log(err);
    res.send("Server is error");
  }
});

// @route PATCH api/users/:id
// @desc update detail user
// @access private admin
router.patch("/:id", auth, authAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const result = await User.findByIdAndUpdate(id, updates, options);
    res.status(200).send("Update user success");
  } catch (err) {
    console.log(err);
    res.send("Server is error");
  }
});

module.exports = router;
