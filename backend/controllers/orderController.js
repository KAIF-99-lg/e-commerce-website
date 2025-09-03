import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// =====================
// Normal Place Order (COD)
// =====================
const placeOrder = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    const { items, amount, address, paymentMethod } = req.body;

    if (!items || !amount || !address || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId: req.userId, // ✅ Token se aaya userId
      items,
      amount,
      address,
      paymentMethod,
      status: "Order Placed",
      date: Date.now(),
    });

    await newOrder.save();

    // ✅ Order ke baad user ka cart clear kar dena
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

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
