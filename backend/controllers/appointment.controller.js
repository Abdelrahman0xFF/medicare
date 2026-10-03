import { Appointment } from "../models/appointment.model.js";
import { logger } from "../utils/logger.js";
import { Patient } from "../models/patient.model.js";
import { QueueEntry } from "../models/queue.model.js";
import { Clinic } from "../models/clinic.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import {
    sendAppointmentConfirmation,
    sendAppointmentCancellation,
    sendAppointmentReschedule,
    sendAppointmentPending,
} from "../services/messaging.service.js";
import { normalizeEgyptianPhone } from "../utils/phone.js";
import { deleteCloudinaryAsset } from "../utils/cloudinaryHelper.js";

export const createAppointment = asyncHandler(async (req, res, next) => {
    const { fullName, phone, reason, date, time } = req.body;
    const normalizedPhone = normalizeEgyptianPhone(phone);

    const existingAppointment = await Appointment.findOne({
        date,
        time,
        status: { $nin: ["rejected", "cancelled"] },
    });

    if (existingAppointment) {
        if (req.file) await deleteCloudinaryAsset(req.file.filename || req.file.path);
        return next(new AppError("This time slot is already booked", 400));
    }

    let receiptImageUrl = null;
    if (req.file && req.file.path) {
        receiptImageUrl = req.file.path;
    }

    let patient = await Patient.findOne({ phone: normalizedPhone });
    if (patient) {
        if (patient.fullName !== fullName.trim()) {
            if (req.file) await deleteCloudinaryAsset(req.file.filename || req.file.path);
            return next(new AppError("This phone number is already associated with a different name", 400));
        }
    } else {
        patient = await Patient.create({ fullName: fullName.trim(), phone: normalizedPhone });
    }

    try {
        const newAppointment = await Appointment.create({
            patientId: patient._id,
            reason,
            date,
            time,
            receiptImageUrl,
            status: "pending",
        });

        if (patient && patient.phone) {
            await sendAppointmentPending({ appointment: newAppointment, patient });
        }

        return res.status(201).json({
            success: true,
            message: "Appointment request submitted",
            data: newAppointment,
        });
    } catch (err) {
        if (req.file) {
            await deleteCloudinaryAsset(req.file.filename || req.file.path);
        }
        if (err.code === 11000) {
            return next(
                new AppError(
                    "This time slot was just booked by another patient. Please select another slot.",
                    409,
                ),
            );
        }
        throw err;
    }
});

export const getAvailableTimeSlots = asyncHandler(async (req, res, next) => {
    const { date } = req.query;
    if (!date) {
        return next(new AppError("Date query parameter is required", 400));
    }

    const dateObj = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const requestedDate = new Date(dateObj);
    requestedDate.setHours(0, 0, 0, 0);

    if (requestedDate < today) {
        return res.status(200).json({ success: true, data: [] });
    }

    const isToday = requestedDate.getTime() === today.getTime();

    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    const dayOfWeek = days[dateObj.getDay()];

    const clinic = await Clinic.findOne({ tenantId: "main_clinic" });
    if (!clinic) {
        return next(new AppError("Clinic configuration not found", 404));
    }

    const workingHours = clinic.workingHours.get(dayOfWeek);

    if (!workingHours || !workingHours.start || !workingHours.end) {
        return res.status(200).json({ success: true, data: [] });
    }

    const generateTimeSlots = (start, end) => {
        const slots = [];
        let current = new Date(`1970-01-01T${start}:00Z`);
        const endTime = new Date(`1970-01-01T${end}:00Z`);

        while (current < endTime) {
            slots.push(current.toISOString().substring(11, 16));
            current.setMinutes(current.getMinutes() + 30);
        }
        return slots;
    };

    const allTimeSlots = generateTimeSlots(
        workingHours.start,
        workingHours.end,
    );

    const appointments = await Appointment.find({
        date,
        status: { $nin: ["rejected", "cancelled"] },
    });

    const bookedTimes = appointments.map((appt) => appt.time);

    const now = new Date();
    const currentTimeString = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const availableTimeSlots = allTimeSlots.filter((time) => {
        if (bookedTimes.includes(time)) return false;
        if (isToday && time < currentTimeString) return false;
        return true;
    });

    return res.status(200).json({ success: true, data: availableTimeSlots });
});

export const getAppointments = asyncHandler(async (req, res, next) => {
    const filter = req.query.date ? { date: req.query.date } : {};
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
        Appointment.find(filter)
            .skip(skip)
            .limit(limit)
            .populate("patientId", "fullName phone")
            .sort({ date: 1, time: 1 }),
        Appointment.countDocuments(filter),
    ]);

    const safeAppointments = appointments.map((appt) => {
        const obj = appt.toJSON();
        if (!obj.patientId) {
            obj.patientId = { id: "", fullName: "Unknown Patient", phone: "" };
        }
        return obj;
    });

    return res.status(200).json({
        success: true,
        data: safeAppointments,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
});

export const getPatientAppointments = asyncHandler(async (req, res, next) => {
    const { phone, fullName } = req.params;
    const normalizedPhone = normalizeEgyptianPhone(phone);
    const patient = await Patient.findOne({ phone: normalizedPhone, fullName: fullName.trim() });
    if (!patient) {
        return next(new AppError("Patient not found", 404));
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [appointments, total] = await Promise.all([
        Appointment.find({ patientId: patient._id })
            .skip(skip)
            .limit(limit)
            .sort({ date: -1, time: -1 }),
        Appointment.countDocuments({ patientId: patient._id }),
    ]);

    return res.status(200).json({ 
        success: true, 
        data: appointments,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    });
});

export const updateAppointmentStatus = asyncHandler(async (req, res, next) => {
    const { status, reason } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { status },
        { returnDocument: "after" },
    );

    if (!appointment) {
        return next(new AppError("Appointment not found", 404));
    }

    let responseMessage = `Appointment ${status}`;

    if ((status === "rejected" || status === "cancelled") && appointment.receiptImageUrl) {
        const deleted = await deleteCloudinaryAsset(appointment.receiptImageUrl);
        if (!deleted) {
            responseMessage += " (Warning: receipt image cleanup failed)";
        }
    }

    const patient = await Patient.findById(appointment.patientId);
    if (patient) {
        if (status === "approved") {
            await sendAppointmentConfirmation({ appointment, patient });
        } else if (status === "rejected" || status === "cancelled") {
            await sendAppointmentCancellation({ appointment, patient, reason });
        }
    }

    return res.status(200).json({
        success: true,
        message: responseMessage,
        data: appointment,
    });
});

export const rescheduleAppointment = asyncHandler(async (req, res, next) => {
    const { date, time, phone, fullName } = req.body;
    const normalizedPhone = normalizeEgyptianPhone(phone);

    const patient = await Patient.findOne({ phone: normalizedPhone, fullName: fullName.trim() });
    if (!patient) {
        return next(new AppError("Patient not found", 404));
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        return next(new AppError("Appointment not found", 404));
    }
    if (appointment.patientId.toString() !== patient._id.toString()) {
        return next(
            new AppError("This appointment does not belong to you", 403),
        );
    }
    if (appointment.status === "rejected" || appointment.status === "cancelled") {
        return next(
            new AppError("Cannot reschedule a rejected or cancelled appointment", 400),
        );
    }

    const slotTaken = await Appointment.findOne({
        _id: { $ne: appointment._id },
        date,
        time,
        status: { $nin: ["rejected", "cancelled"] },
    });
    if (slotTaken) {
        return next(new AppError("This time slot is already booked", 400));
    }

    appointment.date = date;
    appointment.time = time;
    appointment.status = "pending";
    appointment.checkedIn = false;

    try {
        await appointment.save();

        if (patient) {
            await sendAppointmentReschedule({ appointment, patient });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment rescheduled successfully",
            data: appointment,
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(
                new AppError(
                    "This time slot was just booked by another patient. Please select another slot.",
                    409,
                ),
            );
        }
        throw err;
    }
});

export const cancelAppointment = asyncHandler(async (req, res, next) => {
    const { phone, fullName, reason } = req.body;
    const normalizedPhone = normalizeEgyptianPhone(phone);

    const patient = await Patient.findOne({ phone: normalizedPhone, fullName: fullName.trim() });
    if (!patient) {
        return next(new AppError("Patient not found", 404));
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
        return next(new AppError("Appointment not found", 404));
    }
    if (appointment.patientId.toString() !== patient._id.toString()) {
        return next(
            new AppError("This appointment does not belong to you", 403),
        );
    }
    if (appointment.status === "rejected" || appointment.status === "cancelled") {
        return next(
            new AppError("Appointment is already cancelled", 400),
        );
    }

    appointment.status = "cancelled";
    await appointment.save();

    if (appointment.receiptImageUrl) {
        await deleteCloudinaryAsset(appointment.receiptImageUrl);
    }

    await sendAppointmentCancellation({ appointment, patient, reason });

    return res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
        data: appointment,
    });
});

export const checkInAppointment = asyncHandler(async (req, res, next) => {
    const existingQueue = await QueueEntry.findOne({
        appointmentId: req.params.id,
    });
    if (existingQueue) {
        return next(
            new AppError("Patient is already checked in to the queue", 400),
        );
    }

    const appointment = await Appointment.findByIdAndUpdate(
        req.params.id,
        { checkedIn: true },
        { returnDocument: "after" },
    );

    if (!appointment) {
        return next(new AppError("Appointment not found", 404));
    }

    try {
        const queueEntry = await QueueEntry.create({
            appointmentId: appointment._id,
            date: appointment.date,
            time: appointment.time || new Date().toISOString().substring(11, 16),
            stage: "waiting",
        });

        return res.status(200).json({
            success: true,
            message: "Patient checked in and added to queue",
            data: { appointment, queueEntry },
        });
    } catch (err) {
        if (err.code === 11000) {
            return next(
                new AppError("Patient is already checked in to the queue", 400),
            );
        }
        throw err;
    }
});
