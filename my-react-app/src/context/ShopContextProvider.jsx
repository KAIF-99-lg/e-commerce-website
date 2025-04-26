import { createContext, useEffect, useState } from "react"
import { products } from "../assets/assets.js"
import { toast } from "react-toastify"

// Create the context object
export const ShopContext = createContext()

// Context provider component
export default function ShopContextProvider(props) {
    const currency = "$"
    const delivery_fee = 10

    const [search,setSearch] = useState("");
    const [showSearch,setShowSearch] = useState(true);
    const [cartItem,setCartItem] = useState({});

    const addToCart = async(itemId, size) => {
        let cartData = structuredClone(cartItem);
        if (!size) {
            toast.error("Please Select Product Size");
            return;
        }
        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1; // ✅ Corrected here
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }
        setCartItem(cartData);
    };
    

    function getCartCount(){

        let cartCount = 0;
        for(const Items in cartItem){
            for(const Item in cartItem[Items]){
                try {
                    if(cartItem[Items][Item]>0){
                        cartCount += cartItem[Items][Item]
                    }
                } catch (error) {
                    
                }
            }
        }

        return cartCount;
    }

    const updateCount = (itemId,size,quantity) =>{
        let cartData = structuredClone(cartItem)
        cartData[itemId][size] = quantity
        setCartItem(cartData);
    }

    const getCartAmount =  () => {
        let totalAmount = 0;
        for (const items in cartItem) {
          let itemInfo = products.find((product) => product._id === items);
          for (const item in cartItem[items]) {
            try {
              if (cartItem[items][item] > 0) {
                totalAmount += itemInfo.price * cartItem[items][item];
              }
            } catch (error) {
              // error handling (currently empty)
            }
          }
        }
        return totalAmount;
      };
      

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItem,
        addToCart,
        getCartCount,
        updateCount,
        getCartAmount
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
