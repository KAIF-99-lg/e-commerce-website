import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  subcategory: String,
  sizes: [String],
  bestseller: Boolean,
  images: [String],
  date: {
    type: Date,
    default: Date.now,
  },
});

const productModel = mongoose.model("Product", productSchema);

export default productModel;
