import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContextProvider";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Link } from "react-router-dom";

export default function Cart() {
  const { products, currency, cartItems, updateCount, refreshCart } =
    useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Transform cartItems into array for rendering
  useEffect(() => {
    const transformCartData = () => {
      const tempData = [];

      for (const productId in cartItems) {
        const sizeData = cartItems[productId];

        for (const size in sizeData) {
          const quantity = sizeData[size];
          if (quantity > 0) {
            tempData.push({
              _id: productId,
              size: size,
              quantity: quantity,
            });
          }
        }
      }

      setCartData(tempData);
      setLoading(false);
    };

    transformCartData();
  }, [cartItems]);

  // Refresh cart from backend
  useEffect(() => {
    if (refreshCart) {
      refreshCart();
    }
  }, [refreshCart]);

  if (loading) {
    return (
      <div className="border-t pt-14 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading your cart...</div>
          <div className="w-12 h-12 border-4 border-t-black border-gray-200 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-14 min-h-screen">
      <div className="text-2xl mb-3">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>

      {cartData.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">🛒</div>
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to see them here</p>
          <Link to="/">
            <button className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors">
              Continue Shopping
            </button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            {cartData.map((item, index) => {
              const productData = products?.find(
                (product) => product._id === item._id
              );

              if (!productData) {
                return (
                  <div
                    key={`${item._id}-${item.size}-${index}`}
                    className="py-4 border-t border-b text-gray-700"
                  >
                    <p className="text-gray-500">Loading product details...</p>
                  </div>
                );
              }

              return (
                <div
                  key={`${item._id}-${item.size}-${index}`}
                  className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <img
                      className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded"
                      src={productData.images?.[0] || assets.placeholder}
                      alt={productData.name || "Product"}
                    />
                    <div>
                      <p className="text-sm sm:text-lg font-medium">
                        {productData.name}
                      </p>
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {currency}
                          {productData.price}
                        </p>
                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-xs sm:text-sm">
                          Size: {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <input
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        updateCount(item._id, item.size, value);
                      }
                    }}
                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center"
                    type="number"
                    min={0}
                    value={item.quantity}
                  />

                  <img
                    onClick={() => updateCount(item._id, item.size, 0)}
                    className="w-4 mr-5 sm:w-5 cursor-pointer hover:opacity-70 transition-opacity"
                    src={assets.bin_icon}
                    alt="Remove item"
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[459px]">
              <CartTotal />
              <div className="w-full text-end">
                <Link to="/placeorder">
                  <button className="bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer hover:bg-gray-800 transition-colors">
                    PROCEED TO CHECKOUT
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
