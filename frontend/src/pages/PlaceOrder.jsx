import { useState } from "react"
import { assets } from "../assets/assets"
import CartTotal from "../components/CartTotal"
import Title from "../components/Title"
import {Link} from "react-router-dom"
export default function PlaceOrder(){

    const [method,setMethod] = useState('cod')
    return(
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14  min-h-[80vh] border-t">

            <div className="flex flex-col gap-4  w-full sm:max-w-[480px]">
                <div className="text-lg sm:text-2xl my-3">
                    <Title text1={"DELIVERY"} text2={"INFORMATION"}/>
                </div>
                
                <div className="flex gap-3">
                    <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First Name" />
                    <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last Name" />
                </div>
                <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Email Address" />
                <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" />
                <div className="flex gap-3">
                    <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" />
                    <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" />
                </div>
                <div className="flex gap-3">
                    <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Zipcode" />
                    <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" />
                </div>
                <input className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Phone No" />
            </div>


            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal/>
                </div>

                <div className="mt-12">
                    <Title text1={"PAYMENT"} text2={"METHOD"}/>
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex items-center  gap-3 border p-2 px-3 cursor-pointer">
                            <p  onClick={()=>setMethod('stripe')} className={`min-w-3.5 h-3.5 border rounded-full ${method==='stripe'?'bg-green-500':''}`}></p>
                            <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
                        </div>

                        <div className="flex items-center  gap-3 border p-2 px-3 cursor-pointer">
                            <p onClick={()=>setMethod('razorpay')} className={`min-w-3.5 h-3.5 border rounded-full ${method==='razorpay'?'bg-green-500':''}`}></p>
                            <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
                        </div>

                        <div className="flex items-center  gap-3 border p-2 px-3 cursor-pointer">
                            
                            <p onClick={()=>setMethod('cod')} className={`min-w-3.5 h-3.5 border rounded-full ${method==='cod'?'bg-green-500':''}`}></p>
                            <p className="text-sm font-medium text-gray-600 mx-4">CASH ON DELIVERY</p>
                        </div>
                    </div>

                    <div className="w-full text-end mt-8">
                       <Link to="/orders"> <button className="bg-black text-white text-sm  px-16 py-3 cursor-pointer">PLACE ORDER</button></Link>
                    </div>
                </div>

            </div>
        </div>
    )
}