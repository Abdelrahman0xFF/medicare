import mongoose from "mongoose";
import { normalizePhone } from "../utils/phone.js";

const patientSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true, trim: true },
        phone: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            set: normalizePhone,
            match: [
                /^\+?[1-9]\d{6,14}$/,
                "Invalid phone number. Must be a valid phone number (e.g. +201012345678 or +966501234567)",
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
