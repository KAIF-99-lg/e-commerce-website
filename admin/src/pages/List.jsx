import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App.jsx";

const List = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(backendUrl + "/api/product/list", {
          headers: { token },
        });
        setProducts(response.data);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(backendUrl + `/api/product/remove/${id}`, {
        headers: { token },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full px-2 sm:px-6 py-4">
      <h2 className="text-2xl font-bold mb-6">Product List</h2>

      <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="sticky top-0 bg-gray-100 shadow-sm z-10">
              <tr>
                <th className="p-3 text-left font-semibold">Image</th>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Price</th>
                <th className="p-3 text-left font-semibold">Category</th>
                <th className="p-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, idx) => (
                <tr key={product._id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                  <td className="p-3">
                    {product.images && product.images[0] && (
                      <img src={product.images[0]} alt={product.name} className="w-12 h-12 object-cover rounded-lg" />
                    )}
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">₹{product.price}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition shadow"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default List;
