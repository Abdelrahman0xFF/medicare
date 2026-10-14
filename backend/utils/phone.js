/**
 * Normalizes any phone number into standard E.164 format (+<countryCode><digits>).
 * Handles:
 * - Already formatted E.164: +201123593773, +966501234567, +14155552671
 * - Leading 00 international prefix: 00201123593773 -> +201123593773
 * - Local Egyptian 11-digit numbers starting with 01: 01123593773 -> +201123593773
 * - 10-digit Egyptian numbers without leading 0: 1123593773 -> +201123593773
 * - 12-digit Egyptian numbers with country code but no +: 201123593773 -> +201123593773
 * - Any international number with country code without +: 966501234567 -> +966501234567
 */
export function normalizePhone(phone) {
    if (!phone) return phone;
    let str = String(phone).trim();

    // Handle spaces from URL decoding (e.g. "+20..." decoded as " 20...")
    if (str.startsWith(" ")) {
        str = "+" + str.trim();
    }

    if (str.startsWith("00")) {
        str = "+" + str.substring(2);
    }

    const hasPlus = str.startsWith("+");
    const digits = str.replace(/\D/g, "");

    if (!digits) return phone;

    // Local Egyptian mobile (010, 011, 012, 015)
    if (digits.startsWith("01") && digits.length === 11) {
        return "+20" + digits.substring(1);
    }

    // Egyptian mobile without leading 0
    if (digits.startsWith("1") && digits.length === 10) {
        return "+20" + digits;
    }

    // Number already had '+'
    if (hasPlus) {
        return "+" + digits;
    }

    // Egyptian number already starting with 20
    if (digits.startsWith("20") && digits.length === 12) {
        return "+" + digits;
    }

    // General international digits without leading plus
    return "+" + digits;
}

// Backward compatibility alias
export const normalizeEgyptianPhone = normalizePhone;

// Permissive regex for phone numbers before normalization (allows + or 00 prefix, Egyptian local format, or international format)
export const PHONE_REGEX = /^(?:\+|00)?[1-9]\d{6,14}$|^01[0125]\d{8}$/;

// Standard E.164 format (starts with +, 7-15 digits)
export const E164_PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

// Backward compatibility alias
export const EGYPTIAN_PHONE_REGEX = PHONE_REGEX;

