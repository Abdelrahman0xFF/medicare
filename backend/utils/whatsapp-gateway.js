import { logger } from "./logger.js";

const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!process.env.WHATSAPP_API_URL) {
      logger.warn("WhatsApp Gateway not configured (WHATSAPP_API_URL is missing). Skipping WhatsApp dispatch.");
      return null;
    }

    const baseUrl = process.env.WHATSAPP_API_URL.replace(/\/+$/, "");
    const apiUrl = `${baseUrl}/api/messages/send`;
    const apiKey = process.env.WHATSAPP_API_KEY;

    const cleanNumber = to ? to.toString().replace(/^\+/, "").trim() : "";

    logger.info(`Dispatching WhatsApp message to ${cleanNumber}...`);

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
      logger.warn(`WhatsApp Gateway returned status ${response.status}: ${JSON.stringify(data)}`);
    } else {
      logger.info(`WhatsApp Gateway dispatched successfully: ${JSON.stringify(data)}`);
    }
    return data;
  } catch (error) {
    logger.error("Error sending WhatsApp message:", error);
  }
};

export { sendWhatsAppMessage };
