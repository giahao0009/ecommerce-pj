const User = require("../models/User");
const Customer = require("../models/Customer");

modeule.exports = async function (req, res, next) {
  try {
    // Get user info by _id
    const user = await User.findOne({ _id: req.user.id });
    if (user.role === 0) {
      next();
    } else {
      return res
        .status(403)
        .json({ error: "Please login with customer accounts" });
    }
  } catch (e) {
    console.log(error);
    res.status(500).send("Server is error");
  }
};
