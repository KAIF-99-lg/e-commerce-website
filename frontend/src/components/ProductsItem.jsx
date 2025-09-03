import { useContext } from "react";
import { ShopContext } from "../context/ShopContextProvider";
import { Link } from "react-router-dom";

export default function ProductsItem({ id, images, name, price }) {
  const { currency } = useContext(ShopContext);

  return (
    <Link className="text-gray-700 cursor-pointer" to={`/products/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={images?.[0] || "/placeholder.png"}  // first image from array
          alt={name}
        />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        {currency}{price}
      </p>
    </Link>
  );
}
