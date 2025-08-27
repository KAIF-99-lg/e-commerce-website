import React from "react";
import { assets } from "../assets/assets";

const NavBar = ({ setToken }) => {
  const handleLogout = () => {
    setToken(""); // App.jsx me token reset hoga
  };

  return (
    <div className="flex items-center justify-between px-[4%] py-2 ">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="Logo" />
      <button
        onClick={handleLogout}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Log Out
      </button>
    </div>
  );
};

export default NavBar;
