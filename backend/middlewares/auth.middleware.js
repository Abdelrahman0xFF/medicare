import { Admin } from "../models/admin.model.js";
import { verifyToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protectAdminRoute = asyncHandler(async (req, res, next) => {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, no token provided",
        });
    }

    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again.",
            });
        }
        return res.status(401).json({
            success: false,
            message: "Invalid or corrupted authentication token.",
        });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, admin no longer exists",
        });
    }

    req.adminId = decoded.id;
    next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    req.adminId = null;

    if (token) {
        try {
            const decoded = verifyToken(token);
            req.adminId = decoded.id;
        } catch (error) {
            req.adminId = null;
        }
    }
    next();
});
