import { QueueEntry } from "../models/queue.model.js";
import { Appointment } from "../models/appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const getLiveQueue = asyncHandler(async (req, res, next) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    let date = req.query.date;
    if (!date) {
        const now = new Date();
        date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }

    const filter = { date };

    const [queue, total] = await Promise.all([
        QueueEntry.find(filter)
            .skip(skip)
            .limit(limit)
            .populate({
                path: "appointmentId",
                select: "time patientId date",
                populate: { path: "patientId", select: "fullName phone" },
            })
            .sort({ createdAt: 1 }),
        QueueEntry.countDocuments(filter),
    ]);

    return res.status(200).json({
        success: true,
        data: queue,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    });
});

export const updateQueueStage = asyncHandler(async (req, res, next) => {
    const { stage } = req.body;
    const updateData = { stage };

    if (stage === "in_consultation") {
        updateData.consultationStartedAt = new Date();
    } else if (stage === "completed") {
        updateData.completedAt = new Date();
    }

    const entry = await QueueEntry.findByIdAndUpdate(
        req.params.id,
        updateData,
        { returnDocument: "after" },
    );

    if (!entry) {
        return next(new AppError("Queue entry not found", 404));
    }

    if (stage === "completed" && entry.appointmentId) {
        await Appointment.findByIdAndUpdate(entry.appointmentId, { status: "completed" });
    }

    return res.status(200).json({
        success: true,
        message: `Patient moved to ${stage}`,
        data: entry,
    });
});
