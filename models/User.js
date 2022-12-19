const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    ranking: {
      type: String,
      default: "Đồng",
    },
    pointCollection: {
      type: Number,
      default: 0,
    },
    status: {
      type: Number,
      default: 1,
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
        productName: {
          type: String,
        },
      },
    ],
    role: { type: Number, default: 0 },
    history: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);
