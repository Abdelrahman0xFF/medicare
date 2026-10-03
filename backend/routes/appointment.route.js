import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";

import {
    createAppointment,
    getAppointments,
    getPatientAppointments,
    updateAppointmentStatus,
    checkInAppointment,
    getAvailableTimeSlots,
    rescheduleAppointment,
} from "../controllers/appointment.controller.js";
import {
    validateAppointmentForm,
    validateUpdateAppointment,
    validateRescheduleAppointment,
} from "../validators/appointment.validator.js";

import { protectAdminRoute } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { bookingLimiter } from "../utils/rateLimiter.js";

export const router = Router();

router.get("/", protectAdminRoute, getAppointments);
router.get("/slots", getAvailableTimeSlots);
router.get("/:phone/:fullName", getPatientAppointments);
router.post(
    "/",
    bookingLimiter,
    upload.single("receiptFile"),
    validateRequest(validateAppointmentForm),
    createAppointment,
);
router.put(
    "/:id",
    protectAdminRoute,
    validateRequest(validateUpdateAppointment),
    updateAppointmentStatus,
);
router.put("/:id/checkin", protectAdminRoute, checkInAppointment);
router.put(
    "/:id/reschedule",
    validateRequest(validateRescheduleAppointment),
    rescheduleAppointment,
);

export default router;
