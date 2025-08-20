import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import ConnectDb from './config/ConnectDb.js';
import connectCloudinary from './config/Cloudinary.js';
import userRouter from './routes/userRouter.js';
import productRouter from './routes/productRouter.js';

const app = express();

app.use(cors());
app.use(express.json());

ConnectDb();
connectCloudinary();


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/user',userRouter)
app.use('/api/product', productRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
