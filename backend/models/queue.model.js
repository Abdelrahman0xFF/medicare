import mongoose from "mongoose";

const queueEntrySchema = new mongoose.Schema(
    {
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
        },
        date: { type: String, required: true },
        time: { type: String, required: true },
        stage: {
            type: String,
            enum: ["waiting", "in_consultation", "completed"],
            default: "waiting",
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; },
        },
    },
);

queueEntrySchema.index({ date: 1, stage: 1, createdAt: 1 });

export const QueueEntry = mongoose.model("QueueEntry", queueEntrySchema);
