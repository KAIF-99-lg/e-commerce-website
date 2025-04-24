import React from "react"
import {Routes,Route} from "react-router-dom"
import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Cart from "./pages/Cart.jsx"
import Collection from "./pages/Collection.jsx"
import Contact from "./pages/Contact.jsx"
import Login from "./pages/Login.jsx"
import Orders from "./pages/Orders.jsx"
import Product from "./pages/Product.jsx"
import PlaceOrder from "./pages/PlaceOrder.jsx"
import NavBar from "./components/NavBar.jsx"
import Footer from "./components/Footer.jsx"
import SearchBar from "./pages/SearchBar.jsx"

export default function App(){

    return(
      <div class="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <NavBar/>
        <SearchBar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/collection" element={<Collection/>}/>
          <Route path="/contact" element={<Contact/>}/>
          <Route path="/product/:productId" element={<Product/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/orders" element={<Orders/>}/>
          <Route path="/placeorder" element={<PlaceOrder/>}/>
        </Routes>
        <Footer/>
      </div>
    )

}