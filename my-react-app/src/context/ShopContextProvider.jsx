import { createContext, useState } from "react"
import { products } from "../assets/assets.js"

// Create the context object
export const ShopContext = createContext()

// Context provider component
export default function ShopContextProvider(props) {
    const currency = "$"
    const delivery_fee = 10

    const [search,setSearch] = useState("");
    const [showSearch,setShowSearch] = useState(true);

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
