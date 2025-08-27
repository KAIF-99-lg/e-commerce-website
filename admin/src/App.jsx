import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Login from "./components/Login";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log("backendUrl =", backendUrl);

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // jab bhi token change hoga localStorage update hoga
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
  <div className="bg-[#f7fafc] min-h-screen w-screen overflow-hidden">
      <ToastContainer />
      {token === "" ? (
        <>
          <Login setToken={setToken} />
        </>
      ) : (
        <>
          <NavBar setToken={setToken} />
          <hr />
          <div className="flex w-screen h-screen">
            <SideBar />
            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/" element={<List token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Order token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
