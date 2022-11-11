const mongoose = require("mongoose");
const Customer = require("../models/Customer");

module.exports = async (req, res, next) => {
  const { customerId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return res.status(403).json({ error: "Customer is not found" });
  }
  try {
    let customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(403).json({ error: "Customer is not found" });
    }
    req.customer = customer;
    next();
  } catch (err) {
    console.log(err);
    res.status(500).send("Server is error");
  }
};
