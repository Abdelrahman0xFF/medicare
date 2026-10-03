import Joi from "joi";
import { EGYPTIAN_PHONE_REGEX } from "../utils/phone.js";

export const validateAppointmentForm = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        phone: Joi.string()
            .pattern(EGYPTIAN_PHONE_REGEX)
            .required()
            .messages({
                "string.pattern.base":
                    "Phone number must be a valid Egyptian mobile number (e.g. 01012345678 or +201012345678).",
            }),
        reason: Joi.string().min(0).max(500).optional().allow(""),
        date: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .custom((value, helpers) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const inputDate = new Date(value);
                inputDate.setHours(0, 0, 0, 0);
                if (inputDate < today) {
                    return helpers.error("date.past");
                }
                return value;
            })
            .required()
            .messages({ "date.past": "Appointment date cannot be in the past" }),
        time: Joi.string()
            .pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/)
            .required(),
        receiptFile: Joi.any().optional(),
    });
    return schema.validate(data);
};

export const validateRescheduleAppointment = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        phone: Joi.string()
            .pattern(EGYPTIAN_PHONE_REGEX)
            .required()
            .messages({
                "string.pattern.base":
                    "Phone number must be a valid Egyptian mobile number (e.g. 01012345678 or +201012345678).",
            }),
        date: Joi.string()
            .pattern(/^\d{4}-\d{2}-\d{2}$/)
            .custom((value, helpers) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const inputDate = new Date(value);
                inputDate.setHours(0, 0, 0, 0);
                if (inputDate < today) {
                    return helpers.error("date.past");
                }
                return value;
            })
            .required()
            .messages({ "date.past": "Appointment date cannot be in the past" }),
        time: Joi.string()
            .pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/)
            .required(),
    });
    return schema.validate(data);
};

export const validateUpdateAppointment = (data) => {
    const schema = Joi.object({
        status: Joi.string()
            .valid("pending", "approved", "rejected", "completed", "cancelled")
            .required(),
        reason: Joi.string().max(500).optional().allow(""),
    });
    return schema.validate(data);
};

export const validateCancelAppointment = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        phone: Joi.string()
            .pattern(EGYPTIAN_PHONE_REGEX)
            .required()
            .messages({
                "string.pattern.base":
                    "Phone number must be a valid Egyptian mobile number (e.g. 01012345678 or +201012345678).",
            }),
        reason: Joi.string().max(500).optional().allow(""),
    });
    return schema.validate(data);
};
