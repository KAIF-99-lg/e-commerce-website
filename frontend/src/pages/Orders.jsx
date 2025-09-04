import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../context/ShopContextProvider.jsx";

const Orders = () => {
  const { backendUrl, token } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/order/userorders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-gray-600">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-lg text-gray-600">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-2xl p-6 shadow-md bg-white hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">
                Order ID: {order._id}
              </span>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  order.status === "Order Placed"
                    ? "bg-blue-100 text-blue-600"
                    : order.status === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Amount + Payment */}
            <div className="mb-4">
              <p className="text-lg font-semibold text-gray-800">
                Amount: ₹{order.amount}
              </p>
              <p className="text-gray-500 text-sm">
                Payment Method: {order.paymentMethod}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                >
                  {/* ✅ only render <img> if item.image exists */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-md text-xs text-gray-500 border">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Date */}
            <p className="text-xs text-gray-400 mt-4">
              Ordered on: {new Date(order.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
