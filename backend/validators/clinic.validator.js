import Joi from "joi";
import { PHONE_REGEX } from "../utils/phone.js";

export const validateClinicUpdate = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        specialization: Joi.string().required(),
        address: Joi.string().required(),
        phone: Joi.string()
            .pattern(PHONE_REGEX)
            .trim()
            .required()
            .messages({
                "string.pattern.base":
                    "Phone number must be a valid phone number (e.g. 01012345678 or +201012345678).",
            }),

        socialMedia: Joi.object()
            .pattern(
                Joi.string().valid(
                    "whatsapp",
                    "facebook",
                    "twitter",
                    "instagram",
                    "linkedin",
                ),
                Joi.object({
                    link: Joi.string().required(),
                }).allow(null),
            )
            .required(),

        workingHours: Joi.object()
            .pattern(
                Joi.string().valid(
                    "monday",
                    "tuesday",
                    "wednesday",
                    "thursday",
                    "friday",
                    "saturday",
                    "sunday",
                ),
                Joi.object({
                    start: Joi.string()
                        .pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/)
                        .required(),
                    end: Joi.string()
                        .pattern(/^([01]\d|2[0-3]):?([0-5]\d)$/)
                        .required(),
                }).allow(null),
            )
            .required(),

        consultationFee: Joi.number().min(0).required(),
        instapayLink: Joi.string().required(),
        walletNumber: Joi.string()
            .pattern(/^(?:01|\+?201)[0125][0-9]{8}$/)
            .trim()
            .required()
            .messages({
                "string.pattern.base":
                    "Wallet number must be a valid Egyptian phone number (e.g. 01012345678).",
            }),
        credentials: Joi.array().items(Joi.string().max(200)).optional(),
    });

    return schema.validate(data);
};
