import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email and password are required" 
            });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email format" 
            });
        }

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password" 
            });
        }

        // Create token
        const token = createToken(user._id);
        
        // Return success response with token
        res.json({ 
            success: true, 
            message: "User logged in successfully", 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error" 
        });
    }
};

const registerUser = async (req,res)=>{
    try {
        const {name,email,password} = req.body;

        const exists = await userModel.findOne({email});
        if(exists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        
        if(!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if(!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "Weak password" });
        }

        // hashing new user
        const salt  = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = createToken(newUser._id);
        
        res.json({ success: true, message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const adminLogin = async (req,res)=>{
    try {
        const {email,password} = req.body;
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password, process.env.JWT_SECRET);
            return res.json({ success: true, message: "Admin logged in successfully", token });
        }
        res.status(401).json({ success: false, message: "Invalid credentials" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export { loginUser, registerUser, adminLogin };