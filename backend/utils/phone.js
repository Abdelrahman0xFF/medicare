export function normalizeEgyptianPhone(phone) {
    if (!phone) return phone;
    let digits = String(phone).trim().replace(/\D/g, "");

    if (digits.startsWith("01") && digits.length === 11) {
        digits = "2" + digits;
    } else if (digits.startsWith("1") && digits.length === 10) {
        digits = "20" + digits;
    }
    return digits;
}

export const EGYPTIAN_PHONE_REGEX = /^(?:01|\+?201)[0125][0-9]{8}$/;
