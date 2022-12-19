const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
    },
    IDCus: {
      type: String,
      required: false,
    },
    account: {
      type: String,
      default: "Khách lẻ",
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
  { _id: false, timestamps: true }
);

// Add plugin
orderSchema.plugin(AutoIncrement);

module.exports = mongoose.model("Order", orderSchema);
