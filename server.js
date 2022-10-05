const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({
  path: "./config/index.env",
});

const app = express();
app.use(bodyParser.json());

// Connect DB
const connectDB = require("./config/db");
connectDB();

// Use middleware
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());

// Routes
app.use("/api/user/", require("./routes/auth.route"));
app.use("/api/category/", require("./routes/productCategory.route"));
app.use("/api/product/", require("./routes/product.route"));
app.get("/", (req, res) => {
  res.send("Homepage");
});

// Page not found
app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
