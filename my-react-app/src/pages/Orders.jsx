import { useContext } from "react"
import { ShopContext } from "../context/ShopContextProvider"
import Title from "../components/Title"

export default function Order() {
  const { products, currency } = useContext(ShopContext)

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>

      <div>
        {products.slice(1, 4).map((item, index) => (
          <div
            key={index}
            className="py-6 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
          >
            {/* Left side: Product Info */}
            <div className="flex items-start gap-6 text-sm flex-1">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="sm:text-base font-medium">{item.name}</p>
                <div className="flex items-center gap-3 mt-2 text-base text-gray-900">
                  <p className="text-lg">{currency}{item.price}</p>
                  <p>Quantity: 1</p>
                  <p>Size: M</p>
                </div>
                <p>
                  Date: <span className="text-gray-400">25, Jul, 2022</span>
                </p>
              </div>
            </div>

            {/* Center: Ready to ship */}
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <p className="text-sm md:text-base">Ready to ship</p>
              </div>
            </div>

            {/* Right side: Track Order button */}
            <div className="flex-1 flex justify-end">
              <button className="border border-gray-400 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
