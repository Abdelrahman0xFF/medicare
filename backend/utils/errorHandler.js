import { logger } from "./logger.js";

export const errorHandler = async (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Session expired. Please log in again.";
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid or corrupted authentication token.";
    } else if (err.message && /not allowed by cors/i.test(err.message)) {
        statusCode = 403;
        message = "Cross-Origin Request Blocked: Origin not permitted.";
    }

    if (statusCode >= 500) {
        logger.error(`[${req.method}] ${req.originalUrl} - ${message}\n${err.stack}`);
    } else {
        logger.warn(`[${req.method}] ${req.originalUrl} - ${statusCode} - ${message}`);
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
