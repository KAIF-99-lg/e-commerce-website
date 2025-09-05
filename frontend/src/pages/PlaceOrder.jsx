import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContextProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";  // ✅ Import

export default function PlaceOrder() {
  const {
    cartItems,
    products,
    getCartAmount,
    delivery_fee,
    currency,
    backendUrl,
    token,
    refreshCart,
  } = useContext(ShopContext);

  const navigate = useNavigate(); // ✅ Initialize navigation

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const initPay = (order) => {
    const options = {
      key: order.key,
      amount: order.order.amount,
      currency: order.order.currency,
      name: "Forever Store",
      description: "Order Payment",
      order_id: order.order.id,
      receipt: order.order.receipt,
      handler: async (response) => {
        try {
          const verifyData = {
            orderId: order.orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };

          const verifyResponse = await axios.post(
            backendUrl + "/api/order/verifyRazorpay",
            verifyData,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyResponse.data.success) {
            toast.success("Payment successful! Order placed 🎉");
            refreshCart();
            navigate("/orders");
          } else {
            toast.error("Payment verification failed");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Payment verification failed");
        }
      },
      theme: {
        color: "#000000",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login to place an order");
      return;
    }

    if (getCartAmount() === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderItems = [];
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (!product) continue;

      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          orderItems.push({
            productId: itemId,
            name: product.name,
            price: product.price,
            size,
            quantity: cartItems[itemId][size],
          });
        }
      }
    }

    const orderData = {
      address: formData,
      items: orderItems,
      amount: getCartAmount() + delivery_fee,
      paymentMethod,
      date: Date.now(),
    };

    try {
      setLoading(true);
      
      let response;
      if (paymentMethod === "razorpay") {
        response = await axios.post(
          backendUrl + "/api/order/razorpay",
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          initPay(response.data);
        } else {
          toast.error(response.data.message || "Failed to create Razorpay order");
        }
      } else {
        // COD or other payment methods
        response = await axios.post(
          backendUrl + "/api/order/place",
          orderData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success) {
          toast.success("Order placed successfully 🎉");
          refreshCart();
          navigate("/orders");
        } else {
          toast.error(response.data.message || "Failed to place order");
        }
      }
    } catch (error) {
      console.error("PLACE ORDER ERROR:", error);
      toast.error("An error occurred while placing your order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="max-w-6xl mx-auto p-4 sm:p-6 mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* Left - Delivery Info */}
      <div className="bg-white p-6 shadow-lg rounded-2xl">
        <h2 className="text-xl font-bold mb-5 text-gray-800 border-b pb-2">
          Delivery Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="text" name="firstName" placeholder="First Name" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
          <input type="text" name="lastName" placeholder="Last Name" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
          <input type="email" name="email" placeholder="Email Address" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 sm:col-span-2 focus:ring-2 focus:ring-black outline-none" />
          <input type="text" name="street" placeholder="Street" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 sm:col-span-2 focus:ring-2 focus:ring-black outline-none" />
          <input type="text" name="city" placeholder="City" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
          <input type="text" name="state" placeholder="State" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
          <input type="text" name="zipCode" placeholder="Zipcode" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
          <input type="text" name="country" placeholder="Country" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-black outline-none" />
          <input type="text" name="phone" placeholder="Phone No" onChange={onChangeHandler} required className="w-full border rounded-lg p-3 sm:col-span-2 focus:ring-2 focus:ring-black outline-none" />
        </div>
      </div>

      {/* Right - Cart & Payment */}
      <div className="flex flex-col gap-6">
        {/* Cart Totals */}
        <div className="bg-white p-6 shadow-lg rounded-2xl">
          <h3 className="text-lg font-bold mb-3 text-gray-800 border-b pb-2">
            Cart Totals
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{currency}{getCartAmount()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>{currency}{delivery_fee}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2 text-gray-900">
              <span>Total</span>
              <span>{currency}{getCartAmount() + delivery_fee}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 shadow-lg rounded-2xl">
          <h3 className="text-lg font-bold mb-3 text-gray-800 border-b pb-2">
            Payment Method
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Stripe */}
            <label
              className={`flex flex-col items-center gap-2 border p-3 rounded-xl cursor-pointer transition ${
                paymentMethod === "stripe"
                  ? "border-black shadow-md"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              <img src={assets.stripe_logo} alt="Stripe" className="h-6" />
              <span className="text-sm">Stripe</span>
            </label>

            {/* Razorpay */}
            <label
              className={`flex flex-col items-center gap-2 border p-3 rounded-xl cursor-pointer transition ${
                paymentMethod === "razorpay"
                  ? "border-black shadow-md"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              <img src={assets.razorpay_logo} alt="Razorpay" className="h-6" />
              <span className="text-sm">Razorpay</span>
            </label>

            {/* COD */}
            <label
              className={`flex flex-col items-center gap-2 border p-3 rounded-xl cursor-pointer transition ${
                paymentMethod === "cod"
                  ? "border-black shadow-md"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="hidden"
              />
              <span className="text-sm font-medium">Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-900 transition disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </form>
  );
}
