import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContextProvider";
import { assets } from "../assets/assets";
import Title from "../components/Title.jsx";
import ProductsItem from "../components/ProductsItem.jsx";

export default function Collections() {
    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState("relevant");

    function handleClick() {
        setShowFilter(prev => !prev);
    }

    function toggleCategory(e) {
        const value = e.target.value;
        if (category.includes(value)) {
            setCategory(prev => prev.filter(item => item !== value));
        } else {
            setCategory(prev => [...prev, value]);
        }
    }

    function toggleSubCategory(e) {
        const value = e.target.value;
        if (subCategory.includes(value)) {
            setSubCategory(prev => prev.filter(item => item !== value));
        } else {
            setSubCategory(prev => [...prev, value]);
        }
    }

    function applyFilter() {
        let productsCopy = [...products];

        if (showSearch && search) {
            productsCopy = productsCopy.filter(item =>
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item =>
                category.includes(item.category)
            );
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item =>
                subCategory.includes(item.subcategory) // ✅ schema me subcategory (lowercase "c")
            );
        }

        setFilterProduct(productsCopy);
    }

    function sort() {
        let sortProduct = [...filterProducts];

        switch (sortType) {
            case "low-high":
                setFilterProduct(sortProduct.sort((a, b) => a.price - b.price));
                break;
            case "high-low":
                setFilterProduct(sortProduct.sort((a, b) => b.price - a.price));
                break;
            default:
                applyFilter();
                break;
        }
    }

    useEffect(() => {
        setFilterProduct(products);
        console.log("All products:", products);
    }, [products]);

    useEffect(() => {
        applyFilter();
    }, [category, subCategory, search, showSearch]);

    useEffect(() => {
        sort();
    }, [sortType]);

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            {/* FILTERS Sidebar */}
            <div className="min-w-60">
                <p
                    className="my-2 text-xl flex items-center cursor-pointer gap-2"
                    onClick={handleClick}
                >
                    FILTERS
                    <img
                        className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
                        src={assets.dropdown_icon}
                        alt=""
                    />
                </p>

                <div
                    className={`mt-6 flex flex-col gap-6 ${
                        showFilter ? "" : "hidden"
                    } sm:block`}
                >
                    {/* CATEGORIES */}
                    <div className="border border-gray-300 p-4 rounded-md">
                        <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                        <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="Men"
                                    onChange={toggleCategory}
                                    className="w-4 h-4"
                                />
                                Men
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="Women"
                                    onChange={toggleCategory}
                                    className="w-4 h-4"
                                />
                                Women
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="Kids"
                                    onChange={toggleCategory}
                                    className="w-4 h-4"
                                />
                                Kids
                            </label>
                        </div>
                    </div>

                    {/* TYPE */}
                    <div className="border border-gray-300 p-4 rounded-md mt-4">
                        <p className="mb-3 text-sm font-medium">TYPE</p>
                        <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="Topwear"
                                    onChange={toggleSubCategory}
                                    className="w-4 h-4"
                                />
                                Topwear
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="Bottomwear"
                                    onChange={toggleSubCategory}
                                    className="w-4 h-4"
                                />
                                Bottomwear
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    value="Winterwear"
                                    onChange={toggleSubCategory}
                                    className="w-4 h-4"
                                />
                                Winterwear
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRODUCT LIST */}
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1="ALL" text2="COLLECTIONS" />
                    <select
                        onChange={e => setSortType(e.target.value)}
                        className="border border-gray-300 text-sm px-2 cursor-pointer"
                    >
                        <option value="relevant">Sort By: Relevant</option>
                        <option value="low-high">Sort By: Low to High</option>
                        <option value="high-low">Sort By: High to Low</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
                    {filterProducts.length === 0 ? (
                        <p className="text-center col-span-full text-gray-500">
                            No products match your filters.
                        </p>
                    ) : (
                        filterProducts.map((item, index) => (
                            <ProductsItem
                                key={index}
                                id={item._id}
                                images={item.images}
                                name={item.name}
                                price={item.price}
                            />
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
