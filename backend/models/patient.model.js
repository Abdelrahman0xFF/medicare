import mongoose from "mongoose";
import { normalizeEgyptianPhone } from "../utils/phone.js";

const patientSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            set: normalizeEgyptianPhone,
            match: [
                /^201[0125][0-9]{8}$/,
                "Invalid Egyptian phone number. Must be a valid mobile number starting with 01 or 20 (e.g. 01012345678 or 201012345678)",
            ],
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

patientSchema.index({ createdAt: -1 });

export const Patient = mongoose.model("Patient", patientSchema);
