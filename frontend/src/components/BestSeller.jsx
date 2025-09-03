import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContextProvider";
import ProductsItem from "./ProductsItem";
import Title from "./Title";

export default function BestSeller() {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter((item) => item.bestseller);
      setBestSeller(filtered.slice(0, 5));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="BEST" text2="SELLER" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => (
          <ProductsItem
            key={index}
            id={item._id}
            images={item.images}   // ✅ first image send
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}
