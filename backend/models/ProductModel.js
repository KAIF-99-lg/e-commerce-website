import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    bestseller: {
        type: Boolean,
    },
    date: {
        type: number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
