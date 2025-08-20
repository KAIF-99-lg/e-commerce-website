import {v2 as cloudinary} from 'cloudinary';
import productModel from '../models/ProductModel.js';

const addProduct  = async (req, res) => {
    try {
        const {name,description,price,category,subcategory,sizes,bestseller} = req.body;
        const images1 = req.files.image1 && req.files.image1[0];
        const images2 = req.files.image2 && req.files.image2[0];
        const images3 = req.files.image3 && req.files.image3[0];
        const images4 = req.files.image4 && req.files.image4[0];

        const images = [images1, images2, images3, images4].filter((item) => item!==undefined);

        const imageUrl = await Promise.all(images.map(async (image) => {
            const url = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
            return url.secure_url;
        }));



        const newProduct = {
            name,
            description,
            price: Number(price),
            category,
            subcategory,
            sizes: sizes.includes('[') ? JSON.parse(sizes) : sizes.split(','), 
            bestseller: bestseller === "true" ? true : false,
            images: imageUrl,
            date: Date.now()
        };

        const product = new productModel(newProduct);

        await product.save();

        res.json({ message: 'Product added successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const listProducts = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const removeProduct  = async (req, res) => {
    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
        res.json({ message: 'Product removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const singleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export { addProduct, listProducts, removeProduct, singleProduct };
