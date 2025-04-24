import { useContext } from "react"
import { ShopContext } from "../context/ShopContextProvider"
import {Link} from "react-router-dom"

export default function ProductsItem({id,image,name,price}){
    const {currency} = useContext(ShopContext)
    return(
       <Link className="text-gray-700 cursor-pointer" to={`/products/:${id}`}>
        <div className="overflow-hidden">
            <img className="hover:scale-110 transition ease-in-out"src={image[0]} alt="" />
        </div>
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-sm font-medium">{currency}{price}</p>
       </Link>
    )
}