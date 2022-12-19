const express = require("express");
const router = express.Router();

// Models
const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");
const User = require("../models/User");
const Order = require("../models/Order");

// Middlewares
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const productId = require("../middlewares/productId");
const formidable = require("formidable");
const fs = require("fs");

// @route POST api/product/
// @desc Create a product
// @access private admin
router.post("/", auth, adminAuth, (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    console.log(fields);
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    if (!files.photo) {
      return res.status(400).json({
        error: "Image is required",
      });
    }
    if (
      files.photo.mimetype !== "image/jpeg" &&
      files.photo.mimetype !== "image/jpg" &&
      files.photo.mimetype !== "image/png"
    ) {
      return res.status(400).json({
        error: "Image type not allowed",
      });
    }

    // Check all fields
    const { name, description, price, category, quantity, shipping } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }
    let product = new Product(fields);
    if (files.photo.size > 1000000) {
      res.status(400).json({
        error: "Image should be less than 1MB in size",
      });
    }
    product.photo.data = fs.readFileSync(files.photo.filepath);
    product.photo.contentType = files.photo.mimetype;

    try {
      await product.save();
      res.json("Product create success");
    } catch (error) {
      console.log(error);
      res.status(500).send("Server error");
    }
  });
});

// @route Get api/product/category/:id
// @desc Get same product
// @access Public
router.get("/category/:id", async (req, res) => {
  const { id } = req.params;
  try {
    let products = await Product.find({ category: id })
      .select("-photo")
      .select("-description")
      .exec();
    console.log(products);
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server is error");
  }
});

// @route Get api/product/sameProduct/:id
// @desc Get same product
// @access Public
router.get("/sameProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).select("category").exec();
    console.log(product);
    const productSameList = await Product.find({ category: product.category })
      .select("-photo")
      .select("-description")
      .limit(5)
      .exec();
    res.status(200).json(productSameList);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server is error");
  }
});

// @route Get api/product/bestGear
// @desc Get a list best gear seller of product
// @access Public
router.get("/bestGear", async (req, res) => {
  try {
    let products = await Product.find({ category: "639aa0264c0e43205b0c932a" })
      .select("-photo")
      .select("-description")
      .limit(4)
      .exec();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server is error");
  }
});

// @route Get api/product/bestPC
// @desc Get a list best PC seller of product
// @access Public
router.get("/bestPC", async (req, res) => {
  try {
    let products = await Product.find({ category: "639a9b014c0e43205b0c92d6" })
      .select("-photo")
      .select("-description")
      .limit(4)
      .exec();
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server is error");
  }
});

// @route Get api/product/bestPC
// @desc Get a list best PC seller of product
// @access Public
router.get("/best", async (req, res) => {
  try {
    let products = await Product.find({})
      .select("-photo")
      .sort([["sold", "desc"]])
      .limit(4)
      .exec();

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server is error");
  }
});

// @route GET api/product/list
// @desc Get all product
// @access public
router.get("/list", async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  try {
    let products = await Product.find({})
      .select("-photo")
      .sort([[sortBy, order]])
      .limit(limit)
      .exec();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route GET api/product/all
// @desc Get all product
// @access public
router.get("/all", async (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  try {
    let products = await Product.find({})
      .select("-photo")
      .sort([[sortBy, order]])
      .populate({ path: "category" })
      .exec();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route Get api/product/categories
// @desc Get a list categories of products
// @access Public
router.get("/categories", async (req, res) => {
  try {
    let categories = await ProductCategory.find({});
    if (!categories) {
      res.status(400).json({ error: "Categories not found" });
    }
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route Get api/product/categories
// @desc Get a list categories of products
// @access Public
router.get("/search", async (req, res) => {
  const query = {};
  if (req.query.search) {
    query.name = {
      $regex: req.query.search,
    };

    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
  }
  console.log(query);
  try {
    let products = await Product.find(query).select("-photo");
    console.log(products);
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route GET api/product/:productID
// @desc Get product by id
// @access Public
router.get("/:productId", async (req, res) => {
  let product = await Product.findById(req.params.productId)
    .select("-photo")
    .exec();
  res.json(product);
});

// @route GET api/product/photo/:productID
// @desc Get product image by id
// @access Public
router.get("/photo/:productId", productId, (req, res) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }

  res.status(400).json({ error: "Failed to load image" });
});

// @route PUT api/product/:productID
// @desc Update product by id
// @access Private admin
router.patch("/:productId", auth, adminAuth, productId, async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).select("-photo").exec();
    if (!product) {
      res.status(404).json({ error: "Product not found" });
    }
    const updates = req.body;
    const options = { new: true };
    const result = await Product.findByIdAndUpdate(productId, updates, options);
    res.status(200).json("Updated successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server is error");
  }
});

// router.patch("/:productId", auth, adminAuth, productId, async());
// router.patch("/:productId", auth, adminAuth, productId, async (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Image could not be uploaded",
//       });
//     }
//     if (!files.photo) {
//       return res.status(400).json({
//         error: "Image is required",
//       });
//     }
//     if (
//       files.photo.mimetype !== "image/jpeg" &&
//       files.photo.mimetype !== "image/jpg" &&
//       files.photo.mimetype !== "image/png"
//     ) {
//       return res.status(400).json({
//         error: "Image type not allowed",
//       });
//     }
//     // Check all fields
//     const { name, description, price, category, quantity, shipping } = fields;
//     if (
//       !name ||
//       !description ||
//       !price ||
//       !category ||
//       !quantity ||
//       !shipping
//     ) {
//       return res.status(400).json({
//         error: "All fields are required",
//       });
//     }
//     const id = req.params.productId;
//     const updates = fields;
//     const options = { new: true };
//     const result = await Product.findByIdAndUpdate(id, updates, options);
//     if (files.photo.size > 1000000) {
//       res.status(400).json({
//         error: "Image should be less than 1MB in size",
//       });
//     }
//     product.photo.data = fs.readFileSync(files.photo.filepath);
//     product.photo.contentType = files.photo.mimetype;

//     try {
//       await product.save();
//       res.json("Product create success");
//     } catch (error) {
//       console.log(error);
//       res.status(500).send("Server error");
//     }
//   });
// });

// @route DELETE api/product/:productID
// @desc Delete product by id
// @access Private admin
router.delete("/:productId", auth, adminAuth, productId, async (req, res) => {
  let product = req.product;
  try {
    let order = await Order.find({ "orderDetail.productId": product._id });
    let cart = await User.find({ "cart.productId": product._id });

    console.log(order);
    console.log(cart);
    if (order.length > 0) {
      res.status(402).json({
        error:
          "Không thể xoá sản phẩm do sản phẩm đang tồn tại trong một hoá đơn",
      });
    }

    if (cart.length > 0) {
      res.status(403).json({
        error:
          "Không thể xoá sản phẩm do sản phẩm đang tồn tại trong một giỏ hàng",
      });
    }
    let deleteProduct = await product.remove();
    if (order === [] && cart === []) {
      res.status(200).json({ message: "Thực hiện xoá thành công" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
