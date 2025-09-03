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
          Authorization: `Bearer ${token}`, // ✅ required for authUser
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
          >
            <div className="flex justify-between items-center mb-2">
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

            <div className="mb-2">
              <p className="text-gray-700 font-medium">
                Amount: ₹{order.amount}
              </p>
              <p className="text-gray-600 text-sm">
                Payment Method: {order.paymentMethod}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-1">Items:</h4>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {order.items.map((item, idx) => (
                  <li key={idx}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Ordered on: {new Date(order.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
