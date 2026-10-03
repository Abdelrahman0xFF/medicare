import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        reason: { type: String, default: "" },
        date: { type: String, required: true },
        time: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed", "cancelled"],
            default: "pending",
        },
        receiptImageUrl: { type: String },
        checkedIn: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; },
        },
    },
);

appointmentSchema.index({ date: 1, status: 1 });
appointmentSchema.index(
    { date: 1, time: 1 },
    {
        unique: true,
        partialFilterExpression: { status: { $in: ["pending", "approved", "completed"] } },
    },
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
