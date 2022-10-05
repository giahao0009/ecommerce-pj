const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, () => {
      console.log("Connect DB");
    });
  } catch (err) {
    console.log("Cant connect");
  }
};

module.exports = connectDB;
