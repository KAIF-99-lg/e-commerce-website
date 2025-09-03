import userModel from "../models/userModel.js";
import ProductModel from "../models/productModel.js"; // 👈 ye line add ki hai

// -------------------------
// Add to Cart
// -------------------------
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size } = req.body;

    if (!userId || !productId || !size) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const updatePath = `cartData.${productId}.${size}`;

    const user = await userModel.findByIdAndUpdate(
      userId,
      { $inc: { [updatePath]: 1 } }, // quantity +1
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// -------------------------
// Update Cart Quantity
// -------------------------
const updateToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, size, quantity } = req.body;

    if (!userId || !productId || !size || quantity == null) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const updatePath = `cartData.${productId}.${size}`;

    let updateQuery;
    if (quantity <= 0) {
      updateQuery = { $unset: { [updatePath]: "" } }; // remove this size
    } else {
      updateQuery = { $set: { [updatePath]: quantity } }; // set new quantity
    }

    const user = await userModel.findByIdAndUpdate(userId, updateQuery, { new: true });

    // Agar productId ke andar sab sizes delete ho gaye ho to cleanup
    if (user?.cartData?.[productId] && Object.keys(user.cartData[productId]).length === 0) {
      delete user.cartData[productId];
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cartData: user.cartData,
    });
  } catch (error) {
    console.error("❌ Error updating cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// -------------------------
// Get User Cart
// -------------------------
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ success: false, message: "User ID missing" });

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // ✅ Yahan products fetch karo
    const productIds = Object.keys(user.cartData || {});
    const products = await ProductModel.find({ _id: { $in: productIds } });

    return res.status(200).json({
      success: true,
      message: "User cart retrieved successfully",
      cartData: user.cartData || {},
      products,
    });
  } catch (error) {
    console.error("❌ Error retrieving cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export { addToCart, updateToCart, getUserCart };
