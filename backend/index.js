import express from "express";
import helmet from "helmet";
import { logger } from "./utils/logger.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/router.js";
import cors from "cors";
import { connectDB } from "./config/db.config.js";
import { cloudinaryConfig } from "./config/cloudinary.config.js";
import { twilioConfig } from "./config/twilio.config.js";
import { limiter } from "./utils/rateLimiter.js";
import { morganMiddleware } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./utils/errorHandler.js";

dotenv.config();

await connectDB();
cloudinaryConfig();
twilioConfig();

const app = express();

app.set("trust proxy", 1);

// Security HTTP headers
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }),
);

// Restricted CORS configuration
const configuredFrontend = process.env.FRONTEND_URL?.replace(/\/+$/, "");
const allowedOrigins = [
    configuredFrontend,
    "http://localhost:4200",
    "http://localhost:3000",
    "http://127.0.0.1:4200",
    "http://127.0.0.1:3000",
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            const corsError = new Error(`Origin '${origin}' is not allowed by CORS`);
            corsError.statusCode = 403;
            return callback(corsError);
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    }),
);

app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware);
app.use(limiter);

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api", router);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
if (process.env.VERCEL !== "1") {
    app.listen(PORT, () => {
        logger.info(`MediCare backend listening on port ${PORT}`);
    });
}

export default app;
