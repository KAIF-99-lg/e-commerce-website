import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContextProvider";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts.jsx";

export default function Product() {
    const { productId: rawProductId } = useParams();
    const productId = rawProductId.startsWith(":") ? rawProductId.slice(1) : rawProductId;

    const { products, currency,cartItem,addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [image, setImage] = useState("");
    const [size,setSize] = useState("");
    const [activeTab,setActiveTab] = useState("description")

    const fetchProductData = async () => {
        if (products && products.length > 0) {
            products.forEach((item) => {
                if (item._id === productId) {
                    setProductData(item);
                    setImage(item.image[0]);
                }
            });
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [productId, products]);

    return productData ? (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
            {/* Container for entire layout */}
            <div className="flex flex-col lg:flex-row gap-10 items-start">

                {/* Left Side: Thumbnail Images */}
                <div className="flex flex-row lg:flex-col gap-3 w-full lg:w-[10%] overflow-x-auto lg:overflow-y-auto">
                    {productData?.image?.map((item, index) => (
                        <img
                            onClick={() => setImage(item)}
                            src={item}
                            key={index}
                            className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 border"
                            alt=""
                        />
                    ))}
                </div>

                {/* Middle: Main Image */}
                <div className="w-full lg:w-[45%] flex justify-center">
                    <img src={image} className="w-full max-h-[600px] object-contain" alt="" />
                </div>

                {/* Right: Product Info */}
                <div className="w-full lg:w-[45%]">
                    <h1 className="font-semibold text-2xl mb-4">{productData.name}</h1>

                    <div className="flex items-center gap-1 mb-4">
                        <img src={assets.star_icon} alt="star" className="w-4" />
                        <img src={assets.star_icon} alt="star" className="w-4" />
                        <img src={assets.star_icon} alt="star" className="w-4" />
                        <img src={assets.star_icon} alt="star" className="w-4" />
                        <img src={assets.star_dull_icon} alt="star" className="w-4" />
                        <p className="pl-2 text-gray-500">(122)</p>
                    </div>

                    <p className="text-3xl font-bold mb-6">{currency}{productData.price}</p>

                    <p className="text-gray-600">{productData.description}</p>

                    <div className="flex flex-col gap-4 my-8">
                        <p>Select Size</p>
                        <div className="flex gap-2">
                            {productData.sizes.map((item, index) => (
                            <button
                                onClick={()=>setSize(item)}
                                className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500':''}`}
                                key={index}
                            >
                                {item}
                            </button>
                            ))}
                        </div>
                        </div>
                        <button
                        className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 rounded-lg transition-all"
                        onClick = {()=>addToCart(productData._id,size)}
                        >
                        ADD TO CART
                        </button>
                        <hr className="mt-8 w-4/5"/>
                        <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
                            <p>100% Original product.</p>
                            <p>Cash on delivery is available on this product.</p>
                            <p>Easy return and exchange policy within 7 days.</p>
                        </div>
                    </div>
            </div>
            
    <div className="mt-20 w-full px-4 sm:px-8">
      {/* Tabs */}
      <div className="flex border rounded-xl overflow-hidden w-fit shadow-sm mx-auto">
        <button
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === 'description'
              ? 'bg-white text-black shadow-inner'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium transition-all duration-200 ${
            activeTab === 'reviews'
              ? 'bg-white text-black shadow-inner'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews (122)
        </button>
      </div>

      {/* Content */}
      <div className="mt-6 rounded-xl border px-6 py-6 text-sm text-gray-700 bg-white shadow-md space-y-4 leading-relaxed max-w-2xl mx-auto">
        {activeTab === 'description' ? (
          <>
            <p>
              An e-commerce website is an online platform that facilitates the buying and selling of goods and services over the internet.
            </p>
            <p>
              E-commerce websites typically display products or services along with detailed descriptions, prices, and images to help customers make informed purchasing decisions.
            </p>
          </>
        ) : (
          <p>⭐️⭐️⭐️⭐️⭐️ — Very good product! Totally worth it.</p>
        )}
      </div>

      <RelatedProducts 
        category={productData.category} 
        subCategory={productData.subCategory} 
      />

    </div>

        </div>
    ) : (
        <div className="text-center text-gray-500 py-10 text-lg">
            Loading product...
        </div>
    );
}
