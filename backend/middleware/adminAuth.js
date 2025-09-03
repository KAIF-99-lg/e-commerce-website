import jwt from "jsonwebtoken";

const adminAuth = (req, res, next) => {
    try {
        // ✅ Get token from custom header
        const token = req.headers.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not Authorized, Login Again"
            });
        }

        // ✅ Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Check if it matches admin credentials
        const expected = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        if (decoded !== expected) {
            return res.status(403).json({
                success: false,
                message: "Not Authorized, Login Again"
            });
        }

        // Continue
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Invalid or Expired Token"
        });
    }
};

export default adminAuth;