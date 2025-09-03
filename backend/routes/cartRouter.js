import express from "express";
import { addToCart,updateToCart,getUserCart } from "../controllers/cartControllers.js";
import authUser from "../middleware/auth.js";


const cartRouter = express.Router();

cartRouter.post("/add",authUser, addToCart);
cartRouter.post("/update",authUser, updateToCart);
cartRouter.post("/get",authUser, getUserCart);

export default cartRouter;