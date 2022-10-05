const mongoose = require("mongoose");

const ProductCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = ProductCategory = mongoose.model(
  "ProductCategory",
  ProductCategorySchema
);
