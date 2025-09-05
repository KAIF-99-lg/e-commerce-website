import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import ConnectDb from './config/ConnectDb.js';
import connectCloudinary from './config/Cloudinary.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';
import cartRouter from'./routes/cartRouter.js';
import orderRouter from './routes/orderRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

ConnectDb();
connectCloudinary();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

console.log("✅ Registering routers...");

app.use('/api/user',userRouter)
console.log("✅ userRouter mounted at /api/user");

app.use('/api/product', productRouter);
console.log("✅ productRouter mounted at /api/product");

app.use('/api/cart', cartRouter);
console.log("✅ cartRouter mounted at /api/cart");

app.use('/api/order',orderRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
