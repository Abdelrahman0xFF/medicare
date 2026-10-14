import { client } from "../config/twilio.config.js";
import { logger } from "./logger.js";
import { normalizePhone } from "./phone.js";

export const sendSMS = async (to, body) => {
    try {
        if (!client || !process.env.TWILIO_PHONE_NUMBER) {
            logger.warn("Twilio SMS client or TWILIO_PHONE_NUMBER not configured. Skipping SMS dispatch.");
            return null;
        }

        const formattedTo = normalizePhone(to);
        if (!formattedTo || !/^\+[1-9]\d{6,14}$/.test(formattedTo)) {
            logger.error(`[Twilio SMS] Invalid recipient phone number: ${to}`);
            return null;
        }

        logger.info(`[Twilio SMS] Sending SMS to ${formattedTo}...`);

        const message = await client.messages.create({
            body: body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedTo,
        });

        return message;
    } catch (error) {
        logger.error(`Failed to send SMS to ${to}: ${error.message}`);
    }
};
