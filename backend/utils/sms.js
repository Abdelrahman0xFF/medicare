import { client } from "../config/twilio.config.js";
import { logger } from "./logger.js";

export const sendSMS = async (to, body) => {
    try {
        if (!client || !process.env.TWILIO_PHONE_NUMBER) {
            logger.warn("Twilio SMS client or TWILIO_PHONE_NUMBER not configured. Skipping SMS dispatch.");
            return null;
        }

        let formattedTo = to;
        if (formattedTo.startsWith("01") && formattedTo.length === 11) {
            formattedTo = "+20" + formattedTo.substring(1);
        } else if (!formattedTo.startsWith("+")) {
            formattedTo = "+20" + formattedTo.replace(/^0+/, "");
        }

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
