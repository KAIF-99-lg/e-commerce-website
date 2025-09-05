import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "../services/emailService.js";

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

    // Send order confirmation email
    const user = await userModel.findById(req.userId);
    console.log("📧 User found for email:", user?.email);
    if (user && user.email) {
      console.log("📤 Sending email to:", user.email);
      const emailSent = await sendOrderConfirmationEmail(user.email, {
        orderId: newOrder._id,
        items: enrichedItems,
        amount,
        address
      });
      console.log("📧 Email sent status:", emailSent);
    } else {
      console.log("❌ No user email found");
    }

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
// Place Order using Razorpay
// =====================
const placeOrderRazorpay = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "User not authorized" });
    }

    const { items, amount, address } = req.body;

    if (!items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Initialize Razorpay
    console.log("🔑 Razorpay Key ID:", process.env.RAZORPAY_KEY_ID ? "Found" : "Missing");
    console.log("🔐 Razorpay Secret:", process.env.RAZORPAY_KEY_SECRET ? "Found" : "Missing");
    
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ 
        success: false, 
        message: "Razorpay credentials not configured properly" 
      });
    }
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    console.log("✅ Razorpay instance created successfully");

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
    };

    console.log("💰 Creating Razorpay order with options:", options);
    const razorpayOrder = await razorpay.orders.create(options);
    console.log("✅ Razorpay order created:", razorpayOrder.id);

    // Enrich items with product details
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const product = await productModel.findById(item.productId);
          return {
            productId: item.productId,
            name: product?.name || "Unknown",
            image: Array.isArray(product?.images) && product.images.length > 0 ? product.images[0] : "",
            quantity: item.quantity,
            size: item.size,
          };
        } catch (err) {
          return {
            productId: item.productId,
            name: "Unknown",
            image: "",
            quantity: item.quantity,
            size: item.size,
          };
        }
      })
    );

    // Create order in database with pending status
    const newOrder = new orderModel({
      userId: req.userId,
      items: enrichedItems,
      amount,
      address,
      paymentMethod: "razorpay",
      status: "Payment Pending",
      razorpayOrderId: razorpayOrder.id,
      date: Date.now(),
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    if (error.statusCode === 401) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid Razorpay credentials. Please check your Key ID and Secret.",
        error: "Authentication failed" 
      });
    }
    res.status(500).json({ success: false, message: "Error creating Razorpay order", error: error.message });
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

// =====================
// Verify Razorpay Payment
// =====================
const verifyRazorpay = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification data" });
    }

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    // Update order status
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      {
        status: "Order Placed",
        razorpayPaymentId: razorpay_payment_id,
        paymentVerified: true,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Send order confirmation email
    const user = await userModel.findById(updatedOrder.userId);
    console.log("📧 User found for Razorpay email:", user?.email);
    if (user && user.email) {
      console.log("📤 Sending Razorpay confirmation email to:", user.email);
      const emailSent = await sendOrderConfirmationEmail(user.email, {
        orderId: updatedOrder._id,
        items: updatedOrder.items,
        amount: updatedOrder.amount,
        address: updatedOrder.address
      });
      console.log("📧 Razorpay email sent status:", emailSent);
    } else {
      console.log("❌ No user email found for Razorpay order");
    }

    // Clear user cart
    await userModel.findByIdAndUpdate(updatedOrder.userId, { cartData: {} });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Error verifying payment", error: error.message });
  }
};

// ✅ Export all functions
export { placeOrder, placeOrderStripe, placeOrderRazorpay, verifyRazorpay, allOrders, userOrders, updateStatus };
