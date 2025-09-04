import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // fetch all orders
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        {
          headers: { token },
        }
      );
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      // call backend updateStatus route
      await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );

      // update UI locally without full refresh
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Orders</h2>

      {orders && orders.length > 0 ? (
        <div className="max-h-[500px] overflow-y-auto rounded-xl shadow-md border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 border-b text-left">Order ID</th>
                <th className="py-3 px-4 border-b text-left">User ID</th>
                <th className="py-3 px-4 border-b text-left">Amount</th>
                <th className="py-3 px-4 border-b text-left">Payment</th>
                <th className="py-3 px-4 border-b text-left">Status</th>
                <th className="py-3 px-4 border-b text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{order._id}</td>
                  <td className="py-2 px-4 border-b">{order.userId}</td>
                  <td className="py-2 px-4 border-b font-semibold">
                    ₹{order.amount}
                  </td>
                  <td className="py-2 px-4 border-b">{order.paymentMethod}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option>Order Placed</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(order.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No orders found</p>
      )}
    </div>
  );
};

export default Orders;
