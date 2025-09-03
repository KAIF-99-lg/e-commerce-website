import React, { useState, useContext } from "react";
import axios from "axios";
import { backendUrl, ShopContext } from "../context/ShopContextProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [currentState, setCurrentState] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const { setToken } = useContext(ShopContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentState === "signup") {
        const response = await axios.post(
          backendUrl + "/api/user/register",
          {
            name: form.name,
            email: form.email,
            password: form.password,
          }
        );

        if (response.data.token) {
          toast.success("User registered successfully!");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token); // save token
           console.log("Redirecting to /"); // 👈 debug line
          navigate("/"); // direct home
        }
      } else {
        const response = await axios.post(
          backendUrl + "/api/user/login",
          {
            email: form.email,
            password: form.password,
          }
        );

        if (response.data.token) {
          toast.success("Login successful!");
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token); // save token
          navigate("/");
        } else {
          toast.error(response.data.message || "Invalid credentials");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center from-white to-gray-100">
      <form
        className="w-full max-w-md flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-4xl font-serif font-medium text-center mb-6">
          {currentState === "login" ? "Login —" : "Sign Up —"}
        </h2>

        {currentState === "signup" && (
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="border border-gray-300 rounded-md px-4 py-3 text-lg font-light focus:outline-none focus:border-black placeholder-gray-400"
          />
        )}

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
          className="border border-gray-300 rounded-md px-4 py-3 text-lg font-light focus:outline-none focus:border-black placeholder-gray-400"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
          className="border border-gray-300 rounded-md px-4 py-3 text-lg font-light focus:outline-none focus:border-black placeholder-gray-400"
        />

        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <a href="#" className="hover:underline">
            Forgot your password?
          </a>
          <button
            type="button"
            className="hover:underline text-black"
            onClick={() =>
              setCurrentState(currentState === "login" ? "signup" : "login")
            }
          >
            {currentState === "login" ? "Sign Up" : "Login Here"}
          </button>
        </div>

        <button
          type="submit"
          className="mt-6 bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-gray-800 transition-all w-1/2 mx-auto block"
        >
          {currentState === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
