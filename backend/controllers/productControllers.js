import productModel from "../models/productModel.js";

// ✅ Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, sizes, bestseller } = req.body;

    if (!name || !description || !price || !category || !image) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newProduct = new productModel({
      name,
      description,
      price,
      category,
      image,
      sizes: sizes || [],
      bestseller: bestseller || false,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ Remove Product
const removeProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID missing" });
    }

    await productModel.findByIdAndDelete(productId);

    res.status(200).json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.error("❌ Error removing product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ List Products (FIXED)
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ✅ Single Product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID missing" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching single product:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addProduct, removeProduct, listProducts, singleProduct };
