import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = async (req, res, next) => {
    // Ambil token dari header atau cookie
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({
            status: "Failed",
            message: "Token not found, please login"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: `Invalid token. ${err.message}` });
        }

        // Simpan user_id di req agar bisa digunakan di controller
        req.user = { id: decoded.userId, email: decoded.userEmail }
        next();
    });
};
