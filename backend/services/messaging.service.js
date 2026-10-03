import { sendZagelMessage } from "../utils/zagel.js";
import { sendSMS } from "../utils/sms.js";
import { logger } from "../utils/logger.js";

export const dispatchMessage = async (to, message) => {
    if (!to || !message) {
        logger.warn("[MessagingService] Recipient or message missing, skipping dispatch.");
        return { whatsapp: null, sms: null };
    }

    logger.info(`[MessagingService] Dispatching notification to ${to}...`);

    const [whatsappResult, smsResult] = await Promise.allSettled([
        sendZagelMessage(to, message),
        sendSMS(to, message),
    ]);

    const results = {
        whatsapp: whatsappResult.status === "fulfilled" ? whatsappResult.value : null,
        sms: smsResult.status === "fulfilled" ? smsResult.value : null,
    };

    if (whatsappResult.status === "rejected") {
        logger.error(`[MessagingService] WhatsApp dispatch error: ${whatsappResult.reason}`);
    }
    if (smsResult.status === "rejected") {
        logger.error(`[MessagingService] SMS dispatch error: ${smsResult.reason}`);
    }

    return results;
};

export const sendAppointmentConfirmation = async ({ appointment, patient }) => {
    if (!patient?.phone) return null;
    const patientName = patient.fullName || "عزيزي المريض";
    const message = `مرحباً ${patientName}، تم تأكيد موعدك في عيادة MediCare بنجاح يوم ${appointment.date} الساعة ${appointment.time}. يسعدنا استقبالك ونتمنى لك دوام الصحة والعافية.`;
    return dispatchMessage(patient.phone, message);
};

export const sendAppointmentCancellation = async ({ appointment, patient, reason }) => {
    if (!patient?.phone) return null;
    const patientName = patient.fullName || "عزيزي المريض";
    const reasonText = reason ? ` السبب: ${reason}.` : "";
    const message = `مرحباً ${patientName}، نود إبلاغك بأنه تم إلغاء موعدك في عيادة MediCare ليوم ${appointment.date} الساعة ${appointment.time}.${reasonText} إذا كانت لديك أي استفسارات أو ترغب في إعادة الحجز، يرجى التواصل معنا.`;
    return dispatchMessage(patient.phone, message);
};

export const sendAppointmentReschedule = async ({ appointment, patient }) => {
    if (!patient?.phone) return null;
    const patientName = patient.fullName || "عزيزي المريض";
    const message = `مرحباً ${patientName}، تم تعديل موعدك في عيادة MediCare بنجاح إلى يوم ${appointment.date} الساعة ${appointment.time}. نتطلع لرؤيتك.`;
    return dispatchMessage(patient.phone, message);
};

export const sendAppointmentPending = async ({ appointment, patient }) => {
    if (!patient?.phone) return null;
    const patientName = patient.fullName || "عزيزي المريض";
    const message = `مرحباً ${patientName}، تم استلام طلب حجز موعدك في عيادة MediCare ليوم ${appointment.date} الساعة ${appointment.time}. جاري مراجعة الطلب وسنوافيك بالتأكيد قريباً.`;
    return dispatchMessage(patient.phone, message);
};

export const messagingService = {
    dispatchMessage,
    sendAppointmentConfirmation,
    sendAppointmentCancellation,
    sendAppointmentReschedule,
    sendAppointmentPending,
};

export default messagingService;
