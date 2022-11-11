const express = require("express");
const router = express.Router();

// Models
const ProductCategory = require("../models/ProductCategory");

// Middleware
const auth = require("../middlewares/auth");
const adminAuth = require("../middlewares/adminAuth");
const categoryId = require("../middlewares/categoryId");
const { check, validationResult } = require("express-validator");

// @route POST api/category
// @desc Create category
// @access private admin
router.post(
  "/",
  [check("name", "Name is required").trim().not().isEmpty()],
  auth,
  adminAuth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg,
        al: "Lỗi nè bạn",
      });
    }
    const { name } = req.body;
    try {
      let category = await ProductCategory.findOne({ name });
      if (category) {
        return res.status(403).json({ error: "Category already exist" });
      }
      const newCategory = new ProductCategory({ name });
      category = await newCategory.save();
      res.json(category);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Server error");
    }
  }
);

// @route GET api/category/all
// @desc Get all categories
// @access Public
router.get("/all", async (req, res) => {
  try {
    let data = await ProductCategory.find({});
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route GET api/category/:categoryId
// @desc Get category by id
// @access Public
router.get("/:categoryId", categoryId, async (req, res) => {
  res.json(req.category);
});

// @route PUT api/category/:categoryId
// @desc Update category by id
// @access Private admin
router.put("/:categoryId", auth, adminAuth, categoryId, async (req, res) => {
  let category = req.category;
  const { name } = req.body;
  if (name) category.name = name.trim();
  try {
    category = await category.save();
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// @route DELETE api/category/:categoryId
// @desc Delete category by id
// @access Private admin
router.delete("/:categoryId", auth, adminAuth, categoryId, async (req, res) => {
  let category = req.category;
  try {
    let deleteCategory = await category.remove();
    res.json({ message: `${deleteCategory.name} deleted successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
