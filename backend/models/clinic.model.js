import mongoose from "mongoose";

const workingHoursSchema = new mongoose.Schema(
    {
        start: { type: String, required: true },
        end: { type: String, required: true },
    },
    { _id: false },
);

const socialMediaSchema = new mongoose.Schema(
    {
        platform: { type: String, required: false },
        link: { type: String, required: true },
    },
    { _id: false },
);

const clinicSchema = new mongoose.Schema(
    {
        tenantId: {
            type: String,
            default: "main_clinic",
            unique: true,
            required: true,
        },

        name: { type: String, required: true },
        specialization: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true, trim: true },

        socialMedia: {
            type: Map,
            of: socialMediaSchema,
            default: {},
        },

        workingHours: {
            type: Map,
            of: workingHoursSchema,
            default: {},
        },

        consultationFee: { type: Number, required: true },
        instapayLink: { type: String, required: true },
        walletNumber: { type: String, required: true, trim: true },
        timezone: { type: String, default: "Africa/Cairo" },
        credentials: [{ type: String }],
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => { delete ret._id; delete ret.__v; return ret; },
        },
    },
);

export const Clinic = mongoose.model("Clinic", clinicSchema);
