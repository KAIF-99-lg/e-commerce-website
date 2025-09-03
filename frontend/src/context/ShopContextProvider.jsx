import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";

// Create the context object
export const ShopContext = createContext();

// Context provider component
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function ShopContextProvider(props) {
  const currency = "$";
  const delivery_fee = 10;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [cartLoading, setCartLoading] = useState(false);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      console.log("Token loaded from storage:", storedToken);
    } else {
      console.log("No token found in storage");
    }
  }, []);

  // Listen for storage changes (like when token is set from other components)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken !== token) {
        setToken(storedToken || "");
        console.log("Token updated from storage event:", storedToken);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  // ✅ Helper for auth headers
  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
    },
  });

  // Enhanced cart fetcher
  const getUserCart = useCallback(async () => {
    if (!token) {
      setCartItems({});
      return;
    }
    try {
      setCartLoading(true);
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        getAuthHeaders()
      );

      let cartData = {};
      if (response.data?.user?.cartData) {
        cartData = response.data.user.cartData;
      } else if (response.data?.cartData) {
        cartData = response.data.cartData;
      } else if (response.data?.cart) {
        cartData = response.data.cart;
      }

      setCartItems(cartData || {});
    } catch (error) {
      console.error("Error fetching user cart:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken("");
      }
      setCartItems({});
    } finally {
      setCartLoading(false);
    }
  }, [token]);

  // Call getUserCart when token changes
  useEffect(() => {
    if (token) {
      getUserCart();
    }
  }, [token, getUserCart]);

  // ---------------- CART FUNCTIONS ---------------- //

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Product Size");
      return;
    }

    if (token) {
      // Optimistic update
      setCartItems((prev) => {
        const updated = { ...prev };
        if (!updated[itemId]) updated[itemId] = {};
        if (!updated[itemId][size]) updated[itemId][size] = 0;
        updated[itemId][size] += 1;
        return updated;
      });

      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { productId: itemId, size },
          getAuthHeaders()
        );
        setTimeout(() => getUserCart(), 100);
      } catch (error) {
        console.error("Error updating cart on backend:", error);
        toast.error("Could not update cart");

        // Revert optimistic update
        setCartItems((prev) => {
          const updated = { ...prev };
          if (updated[itemId]?.[size]) {
            updated[itemId][size] -= 1;
            if (updated[itemId][size] <= 0) {
              delete updated[itemId][size];
              if (Object.keys(updated[itemId]).length === 0) {
                delete updated[itemId];
              }
            }
          }
          return updated;
        });
      }
    } else {
      toast.error("Please login first");
    }
  };

  const updateCount = async (itemId, size, quantity) => {
    if (quantity < 0) return;

    if (token) {
      const previousQuantity = cartItems[itemId]?.[size] || 0;

      // Optimistic update
      setCartItems((prev) => {
        const updated = { ...prev };
        if (!updated[itemId]) updated[itemId] = {};
        if (quantity === 0) {
          if (updated[itemId][size]) {
            delete updated[itemId][size];
            if (Object.keys(updated[itemId]).length === 0) {
              delete updated[itemId];
            }
          }
        } else {
          updated[itemId][size] = quantity;
        }
        return updated;
      });

      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { productId: itemId, size, quantity },
          getAuthHeaders()
        );
        setTimeout(() => getUserCart(), 100);
      } catch (error) {
        console.error("Error updating cart quantity on backend:", error);
        toast.error("Could not update cart");

        // Revert optimistic update
        setCartItems((prev) => {
          const updated = { ...prev };
          if (previousQuantity === 0) {
            if (updated[itemId]?.[size]) {
              delete updated[itemId][size];
              if (Object.keys(updated[itemId]).length === 0) {
                delete updated[itemId];
              }
            }
          } else {
            if (!updated[itemId]) updated[itemId] = {};
            updated[itemId][size] = previousQuantity;
          }
          return updated;
        });
      }
    }
  };

  const refreshCart = useCallback(() => {
    getUserCart();
  }, [getUserCart]);

  function getCartCount() {
    let cartCount = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        try {
          if (cartItems[itemId][size] > 0) {
            cartCount += cartItems[itemId][size];
          }
        } catch (error) {
          console.error("Error counting cart items:", error);
        }
      }
    }
    return cartCount;
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (!itemInfo) continue;

      for (const size in cartItems[itemId]) {
        try {
          if (cartItems[itemId][size] > 0) {
            totalAmount += itemInfo.price * cartItems[itemId][size];
          }
        } catch (error) {
          console.error("Error calculating cart amount:", error);
        }
      }
    }
    return totalAmount;
  };

  // ---------------- PRODUCTS ---------------- //

  const getProductData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (response.data.success && response.data.products) {
        setProducts(response.data.products);
      } else {
        toast.error("Invalid response format from backend");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching products");
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  // ---------------- CONTEXT VALUE ---------------- //

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateCount,
    getCartAmount,
    backendUrl,
    token,
    setToken: (newToken) => {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    },
    refreshCart,
    cartLoading,
    getUserCart,
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
}
