import { Router } from "express";

import {
    login,
    getAdminProfile,
    logout,
    createAdmin,
    edit,
    getAllAdmins,
    deleteAdmin,
    getDashboardStats,
} from "../controllers/admin.controller.js";
import {
    validateAdminLogin,
    validateAdminCreation,
    validateAdminUpdate,
} from "../validators/admin.validator.js";

import { protectAdminRoute } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { authLimiter } from "../utils/rateLimiter.js";

export const router = Router();

router.get("/", protectAdminRoute, getAdminProfile);
router.get("/dashboard", protectAdminRoute, getDashboardStats);
router.get("/all", protectAdminRoute, getAllAdmins);
router.post(
    "/",
    protectAdminRoute,
    validateRequest(validateAdminCreation),
    createAdmin,
);
router.put(
    "/",
    protectAdminRoute,
    validateRequest(validateAdminUpdate),
    edit,
);
router.post("/login", authLimiter, validateRequest(validateAdminLogin), login);
router.delete("/:id", protectAdminRoute, deleteAdmin);
router.post("/logout", protectAdminRoute, logout);

export default router;
