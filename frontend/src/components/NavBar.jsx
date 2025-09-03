
import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { ShopContext } from "../context/ShopContextProvider.jsx";

export default function NavBar() {
  const { setShowSearch, getCartCount } = useContext(ShopContext);
  const [visible, setVisible] = React.useState(false);
  const navigate = useNavigate();

  function handleClick() {
    setVisible((prev) => !prev);
  }

  function handleChange() {
    setShowSearch((prev) => !prev);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex items-center justify-between py-5 px-4 sm:px-8 font-medium relative z-40">
      {/* Logo */}
      <Link to="/"><img src={assets.logo} className="w-36" alt="logo" /></Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>Home</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>Collections</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>About</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>Contact</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      {/* Right Icons */}
      <div className="flex items-center gap-6">
        <img onClick={handleChange} src={assets.search_icon} className="w-5 cursor-pointer" alt="search" />
        <div className="group relative">
          {isLoggedIn ? (
            <>
              <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="profile" />
              <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-600 rounded">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                  <p onClick={() => navigate("/orders")} className="cursor-pointer hover:text-black">Orders</p>
                  <p className="cursor-pointer hover:text-black" onClick={handleLogout}>Logout</p>
                </div>
              </div>
            </>
          ) : (
            <Link to="/login">
              <img src={assets.profile_icon} className="w-5 cursor-pointer" alt="profile" />
            </Link>
          )}
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5 min-w-5" alt="cart" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">{getCartCount()}</p>
        </Link>

        {/* Hamburger icon for small screens */}
        <img onClick={handleClick} src={assets.menu_icon} className="w-5 cursor-pointer sm:hidden" alt="menu" />
      </div>

      {/* Mobile Menu Backdrop */}
      {visible && (
        <div onClick={handleClick} className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"></div>
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full bg-white z-40 sm:hidden transition-all duration-300 ease-in-out 
        ${visible ? "w-2/3 opacity-100 pointer-events-auto" : "w-0 opacity-0 pointer-events-none"}`}>
        <div className="flex flex-col h-full px-6 py-4 text-gray-700 gap-4 overflow-y-auto">
          <div onClick={handleClick} className="flex items-center gap-4">
            <img src={assets.dropdown_icon} className="h-4 rotate-180 cursor-pointer" alt="back" />
            <p className="cursor-pointer">Back</p>
          </div>
          <NavLink onClick={handleClick} to="/about" className={({ isActive }) =>`px-4 py-2 ${isActive ? 'bg-black text-white' : 'text-black'} sm:bg-transparent`}>
            About
          </NavLink>
          <NavLink onClick={handleClick} to="/contact" className={({ isActive }) =>`px-4 py-2 ${isActive ? 'bg-black text-white' : 'text-black'} sm:bg-transparent`}>
            Contact
          </NavLink>
          <NavLink onClick={handleClick} to="/collection"className={({ isActive }) =>`px-4 py-2 ${isActive ? 'bg-black text-white' : 'text-black'} sm:bg-transparent`}>
            Collections
          </NavLink>
          <NavLink onClick={handleClick} to="/" className={({ isActive }) =>`px-4 py-2 ${isActive ? 'bg-black text-white' : 'text-black'} sm:bg-transparent`}>
            Home
          </NavLink>
          {isLoggedIn && (
            <p className="cursor-pointer hover:text-black mt-4" onClick={handleLogout}>Logout</p>
          )}
        </div>
      </div>
    </div>
  );
}