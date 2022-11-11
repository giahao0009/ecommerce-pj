const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const customerSchema = new mongoose.Schema(
  {
    cusName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    cusPhone: {
      type: String,
      trim: true,
      required: true,
      maxLength: 10,
    },
    cusMail: {
      type: String,
      trim: true,
      required: true,
      maxLength: 200,
    },
    cusScore: {
      type: Number,
      trim: true,
      default: 0,
    },
    ranking: {
      type: String,
      trim: true,
      default: "Đồng",
    },
    cart: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
