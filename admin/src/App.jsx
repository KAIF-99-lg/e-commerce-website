import React from "react";
import NavBar from "./components/NavBar";
import "./index.css";
import SideBar from "./components/SideBar";
import { Routes,Route } from "react-router-dom";
import Login from "./components/Login";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";

export default function App() {
  const [token, setToken] = React.useState('');

  return (
    <div className="min-h-screen bg-gray-50">
      {token === '' ? (
        <Login />
      ) : (
        <>
          <NavBar />
          <hr/>
          <div className="flex w-full ">
            <SideBar />
            <div className="w-70% mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route path="/add" element={<Add />} />
                <Route path="/list" element={<List />} />
                <Route path="/order" element={<Order />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
