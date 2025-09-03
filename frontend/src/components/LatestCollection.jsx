import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContextProvider";
import Title from "./Title.jsx";
import ProductsItem from "./ProductsItem.jsx";

export default function LatestCollection() {
  const { products } = useContext(ShopContext);
  const [latestProduct, setLatestProduct] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProduct(products.slice(0, 10));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1="LATEST" text2="COLLECTIONS" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProduct.map((item, index) => (
          <ProductsItem
            key={index}
            id={item._id}
            images={item.images}   // ✅ sahi prop pass karna hai
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}
