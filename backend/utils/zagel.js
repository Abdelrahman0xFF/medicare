import { logger } from "./logger.js";

const sendZagelMessage = async (to, message) => {
    try {
        const rawUrl = process.env.ZAGEL_API_URL;
        const apiKey = process.env.ZAGEL_API_KEY;

        if (!rawUrl) {
            logger.warn(
                "[Zagel Gateway] Gateway not configured (ZAGEL_API_URL is missing). Skipping dispatch.",
            );
            return null;
        }

        const baseUrl = rawUrl.replace(/\/+$/, "");
        const apiUrl = `${baseUrl}/api/messages/send`;

        let cleanNumber = to ? to.toString().replace(/^\+/, "").trim() : "";
        if (cleanNumber.startsWith("01") && cleanNumber.length === 11) {
            cleanNumber = "20" + cleanNumber.substring(1);
        }

        logger.info(`[Zagel Gateway] Dispatching WhatsApp message to ${cleanNumber}...`);

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
            body: JSON.stringify({
                number: cleanNumber,
                message: message,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            logger.warn(
                `[Zagel Gateway] Returned status ${response.status}: ${JSON.stringify(data)}`,
            );
        } else {
            logger.info(
                `[Zagel Gateway] Message dispatched successfully to ${cleanNumber}: ${JSON.stringify(data)}`,
            );
        }
        return data;
    } catch (error) {
        logger.error("[Zagel Gateway] Error sending WhatsApp message:", error);
        return null;
    }
};

export { sendZagelMessage, sendZagelMessage as sendWhatsAppMessage };
export default sendZagelMessage;
