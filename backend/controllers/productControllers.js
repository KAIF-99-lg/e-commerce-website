import productModel from "../models/productModel.js";
import {v2 as cloudinary} from 'cloudinary';

// ✅ Add Product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;
    
    console.log('Received data:', { name, description, price, category, subCategory, sizes, bestseller });
    console.log('Files:', req.files);
    
    // Check each field individually
    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!description) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }
    if (!price) {
      return res.status(400).json({ success: false, message: "Price is required" });
    }
    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }

    const images = [];
    if (req.files) {
      if (req.files.image1) images.push(`${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/${req.files.image1[0].filename}`);
      if (req.files.image2) images.push(`${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/${req.files.image2[0].filename}`);
      if (req.files.image3) images.push(`${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/${req.files.image3[0].filename}`);
      if (req.files.image4) images.push(`${process.env.BACKEND_URL || 'http://localhost:4000'}/uploads/${req.files.image4[0].filename}`);
    }

    const newProduct = new productModel({
      name,
      description,
      price: Number(price),
      category,
      subcategory: subCategory,
      images,
      sizes: sizes ? JSON.parse(sizes) : [],
      bestseller: bestseller === 'true',
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
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID missing" });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

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
