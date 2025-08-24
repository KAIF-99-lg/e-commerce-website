import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const SideBar = () => {
  return (
    <aside className="h-screen bg-white border-r border-gray-200 flex flex-col items-center sm:w-56 w-16 py-8 px-2">
            <nav className="flex flex-col gap-8 items-center w-full mt-2">
                <NavLink
                    to="/add"
                    className={({ isActive }) =>
                        `group flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full px-4 py-3 rounded-xl transition-colors duration-200 hover:bg-blue-50 ${isActive ? 'bg-blue-100 font-semibold shadow-sm' : ''}`
                    }
                >
                    <img src={assets.add_icon} alt="Add" className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-gray-900 group-hover:text-pink-400 hidden sm:inline text-[1rem]">Add Item</span>
                </NavLink>

                <NavLink
                    to="/list"
                    className={({ isActive }) =>
                        `group flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full px-4 py-3 rounded-xl transition-colors duration-200 hover:bg-blue-50 ${isActive ? 'bg-blue-100 font-semibold shadow-sm' : ''}`
                    }
                >
                    <img src={assets.order_icon} alt="List" className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-gray-900 group-hover:text-pink-400 hidden sm:inline text-[1rem]">List Item</span>
                </NavLink>

                <NavLink
                    to="/order"
                    className={({ isActive }) =>
                        `group flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full px-4 py-3 rounded-xl transition-colors duration-200 hover:bg-blue-50 ${isActive ? 'bg-blue-100 font-semibold shadow-sm' : ''}`
                    }
                >
                    <img src={assets.order_icon} alt="Order" className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-gray-900 group-hover:text-pink-400 hidden sm:inline text-[1rem]">Order Item</span>
                </NavLink>
            </nav>
        </aside>
  )
}

export default SideBar