import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { backendUrl } from '../App.jsx'
import axios  from 'axios'
import { toast } from 'react-toastify'



const Add = ({token}) => {
  // ✅ All useStates must be inside the component
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")

  const [category, setCategory] = useState("Men")
  const [subCategory, setSubCategory] = useState("Topwear")
  const [bestseller, setBestseller] = useState(false)
  const [sizes, setSizes] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()// prevent page refresh

    // Prepare form data (good if you’re sending files)
    const formData = new FormData()
    image1 && formData.append("image1", image1)
    image2 && formData.append("image2", image2)
    image3 && formData.append("image3", image3)
    image4 && formData.append("image4", image4)

    formData.append("name", name)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("category", category)
    formData.append("subCategory", subCategory)
    formData.append("bestseller", bestseller)
    formData.append("sizes", JSON.stringify(sizes))

    try {
      const response = await axios.post(backendUrl + '/api/product/add', formData, { headers: { token } })
      if (response.data.success) {
        toast.success('Product added successfully!')
        setName("")
        setDescription("")
        setPrice("")
        setCategory("Men")
        setSubCategory("Topwear")
        setBestseller(false)
        setSizes([])
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
      } else {
        toast.error(response.data.message || 'Failed to add product.')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong!')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-3" >
      {/* Upload Images */}
      <div>
        <p>Upload Image</p>
        <div className="flex gap-2">
          {[{id:"image1", file:image1, setFile:setImage1},
            {id:"image2", file:image2, setFile:setImage2},
            {id:"image3", file:image3, setFile:setImage3},
            {id:"image4", file:image4, setFile:setImage4}].map(({id,file,setFile})=>(
              <label key={id} htmlFor={id}>
                <img
                  className="w-20 cursor-pointer"
                  src={file ? URL.createObjectURL(file) : assets.upload_area}
                  alt=""
                />
                <input
                  type="file"
                  id={id}
                  hidden
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
          ))}
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border"
          type="text"
          placeholder='Type Here'
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2 border"
          placeholder='Write the product Description'
          required
        />
      </div>

      {/* Category + SubCategory + Price */}
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2 ">Product Category</p>
          <select
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
            className="w-full px-3 py-2 border"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Sub Category</p>
          <select
            value={subCategory}
            onChange={(e)=>setSubCategory(e.target.value)}
            className="w-full px-3 py-2 border"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            value={price}
            onChange={(e)=>setPrice(e.target.value)}
            className="w-full px-3 py-2 sm:w-[120px] border"
            type="number"
            placeholder="$200"
            required
          />
        </div>
      </div>

      {/* Product Sizes */}
      <div>
        <p className='mb-2'>Product Sizes</p>
        <div className="flex gap-3">
          {["S","M","L","XL","XXL"].map(size=>(
            <p
              key={size}
              onClick={()=> setSizes(prev=> prev.includes(size) ? prev.filter(s=>s!==size) : [...prev,size])}
              className={`px-3 py-1 cursor-pointer border rounded ${
                sizes.includes(size) ? "bg-black text-white" : "bg-slate-200"
              }`}
            >
              {size}
            </p>
          ))}
        </div>
      </div>

      {/* Bestseller */}
      <div className='flex gap-2 mt-2'>
        <input
          type="checkbox"
          id="bestseller"
          checked={bestseller}
          onChange={(e)=>setBestseller(e.target.checked)}
        />
        <label className='cursor-pointer mt-[-9px]' htmlFor="bestseller">Add to Bestseller</label>
      </div>

      {/* Submit Button */}
      <button type="submit" className="w-28 py-4 mt-[-4px] bg-black text-white">ADD</button>
    </form>
  );
}

export default Add
