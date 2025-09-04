import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const placeOrder = async (req, res) => {
  try {
    if (!req.userId) {
      console.log("❌ No req.userId");
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    const { items, amount, address, paymentMethod } = req.body;
    console.log("📥 Incoming Order Body:", req.body);

    if (!items || !amount || !address || !paymentMethod) {
      console.log("❌ Missing fields");
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Enrich items with product name & first image
    const enrichedItems = await Promise.all(
      items.map(async (item, idx) => {
        try {
          const product = await productModel.findById(item.productId);
          console.log(`✅ Product found for item[${idx}]:`, product?.name);

          return {
            productId: item.productId,
            name: product?.name || "Unknown",
            image:
              Array.isArray(product?.images) && product.images.length > 0
                ? product.images[0] // take first image from array
                : "", // fallback
            quantity: item.quantity,
          };
        } catch (err) {
          console.error(`❌ Error fetching product for item[${idx}]:`, err);
          return {
            productId: item.productId,
            name: "Unknown",
            image: "",
            quantity: item.quantity,
          };
        }
      })
    );

    console.log("📝 Enriched Items:", enrichedItems);

    const newOrder = new orderModel({
      userId: req.userId,
      items: enrichedItems,
      amount,
      address,
      paymentMethod,
      status: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();
    console.log("✅ Order saved:", newOrder._id);

    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });
    console.log("🗑️ Cart cleared for user:", req.userId);

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("❌ Order Place Error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while placing order",
      error: error.message,
    });
  }
};

// =====================
// Place Order using Stripe (to be implemented)
// =====================
const placeOrderStripe = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    // TODO: Stripe integration
    res.status(200).json({ success: true, message: "Stripe order logic pending" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error placing Stripe order", error: error.message });
  }
};

// =====================
// Place Order using Razorpay (to be implemented)
// =====================
const placeOrderRazorpay = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    // TODO: Razorpay integration
    res.status(200).json({ success: true, message: "Razorpay order logic pending" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error placing Razorpay order", error: error.message });
  }
};

// =====================
// Fetch all orders (Admin Panel)
// =====================
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).sort({ date: -1 });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

// =====================
// Fetch user orders
// =====================
const userOrders = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    const orders = await orderModel.find({ userId: req.userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching user orders", error: error.message });
  }
};

// =====================
// Update order status (Admin use)
// =====================
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "OrderId and status required" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};

// ✅ Export all functions
export { placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus };
