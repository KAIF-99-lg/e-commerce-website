import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};


const loginUser = async (req,res)=>{

}


const registerUser = async (req,res)=>{
    try {
        const {name,email,password} = req.body;

    const exists = await userModel.findOne({email});
    if(exists) {
        return res.status(400).json({message: "User already exists"});
    }
    
    if(!validator.isEmail(email)) {
        return res.status(400).json({message: "Invalid email"});
    }

    if(!validator.isStrongPassword(password)) {
        return res.status(400).json({message: "Weak password"});
    }

    //hashing new user
    const salt  = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
        name,
        email,
        password: hashedPassword
    });

    await newUser.save();

    const token = createToken(newUser._id);
    
    res.json({message: "User registered successfully", token});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

const adminLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            return res.json({message: "Admin logged in successfully", token});
        }
        res.status(401).json({message: "Invalid credentials"});
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}

export { loginUser, registerUser, adminLogin };