const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    IDCus: {
      type: ObjectId,
      ref: "Customer",
      required: true,
    },
    status: {
      type: Number,
      required: true,
      default: 1,
    },
    amount: {
      type: Number,
      required: true,
    },
    addressDelivery: {
      type: String,
      required: true,
    },
    cusName: {
      type: String,
      required: true,
    },
    cusPhone: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "Thông thường",
    },
    orderDetail: [
      {
        productId: {
          type: ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
