import express from 'express';
import upload from '../middleware/multer.js';
import { addProduct, listProducts, removeProduct, singleProduct } from '../controllers/productControllers.js';
import authAdmin from '../middleware/adminAuth.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post(
  '/add', adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

productRouter.get('/list', listProducts);
productRouter.delete('/remove/:id', adminAuth, removeProduct);
productRouter.get('/single/:id', singleProduct);

export default productRouter;
