import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App.jsx";


const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl+'/api/user/adminLogin',{email,password});
      if(response.data.success === true || response.data.success === "true"){
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      }else{
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Admin Panel</h2>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
