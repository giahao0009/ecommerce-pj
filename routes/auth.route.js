const express = require("express");
const router = express.Router();

// Middleware
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar"); // Get user image by email
const auth = require("../middlewares/auth");

// Models
const User = require("../models/User");

// @route GET api/user/
// @desc User infomation
// @access public

router.get("/", auth, async (req, res) => {
  try {
    // Get user info by id
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("server is error");
  }
});

// @route POST api/user/register
// @desc register user
// @access public

router.post(
  "/register",
  [
    //Validation
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: error.array(),
      });
    }

    // get name, email, password from requests
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      console.log(user);
      // If user exists
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already existes" }],
        });
      }
      // If not exists
      // Get image from mail
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({ name, email, avatar, password });
      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // save user in data
      await user.save();
      // Payload to generate token
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          }
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("Server is died");
    }
  }
);

// @route POST api/user/login
// @desc login user
// @access public

router.post(
  "/login",
  [
    //Validation email and password
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({
        email,
      });

      // If user not found
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid email or password" }] });
      }

      // If user found
      const isMatch = await bcrypt.compare(password, user.password);

      // Password not match
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid email or password" }] });
      }

      // payload for JWT
      const payload = {
        user: { id: user.id },
      };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error);
      res.status(500).send("Server is died");
    }
  }
);

module.exports = router;
