export interface Country {
    name: string;
    code: string;
    dialCode: string; // without '+'
    flag: string;
    placeholder: string;
    priority?: boolean;
}

export const COUNTRIES: Country[] = [
    // Priority / MENA countries
    { name: 'Egypt', code: 'EG', dialCode: '20', flag: '🇪🇬', placeholder: '10 1234 5678', priority: true },
    { name: 'Saudi Arabia', code: 'SA', dialCode: '966', flag: '🇸🇦', placeholder: '50 123 4567', priority: true },
    { name: 'United Arab Emirates', code: 'AE', dialCode: '971', flag: '🇦🇪', placeholder: '50 123 4567', priority: true },
    { name: 'Kuwait', code: 'KW', dialCode: '965', flag: '🇰🇼', placeholder: '5123 4567', priority: true },
    { name: 'Qatar', code: 'QA', dialCode: '974', flag: '🇶🇦', placeholder: '3312 3456', priority: true },
    { name: 'Bahrain', code: 'BH', dialCode: '973', flag: '🇧🇭', placeholder: '3612 3456', priority: true },
    { name: 'Oman', code: 'OM', dialCode: '968', flag: '🇴🇲', placeholder: '9123 4567', priority: true },
    { name: 'Jordan', code: 'JO', dialCode: '962', flag: '🇯🇴', placeholder: '7 9012 3456', priority: true },
    { name: 'Iraq', code: 'IQ', dialCode: '964', flag: '🇮🇶', placeholder: '770 123 4567', priority: true },
    { name: 'Lebanon', code: 'LB', dialCode: '961', flag: '🇱🇧', placeholder: '70 123 456', priority: true },
    { name: 'Palestine', code: 'PS', dialCode: '970', flag: '🇵🇸', placeholder: '59 912 3456', priority: true },
    { name: 'United States', code: 'US', dialCode: '1', flag: '🇺🇸', placeholder: '202 555 0123', priority: true },
    { name: 'United Kingdom', code: 'GB', dialCode: '44', flag: '🇬🇧', placeholder: '7911 123456', priority: true },
    { name: 'Germany', code: 'DE', dialCode: '49', flag: '🇩🇪', placeholder: '151 12345678', priority: true },
    { name: 'Canada', code: 'CA', dialCode: '1', flag: '🇨🇦', placeholder: '416 555 0123', priority: true },

    // Additional Arab & Regional Countries
    { name: 'Algeria', code: 'DZ', dialCode: '213', flag: '🇩🇿', placeholder: '551 23 45 67' },
    { name: 'Libya', code: 'LY', dialCode: '218', flag: '🇱🇾', placeholder: '91 234 5678' },
    { name: 'Morocco', code: 'MA', dialCode: '212', flag: '🇲🇦', placeholder: '661 234 567' },
    { name: 'Sudan', code: 'SD', dialCode: '249', flag: '🇸🇩', placeholder: '91 234 5678' },
    { name: 'Syria', code: 'SY', dialCode: '963', flag: '🇸🇾', placeholder: '944 123 456' },
    { name: 'Tunisia', code: 'TN', dialCode: '216', flag: '🇹🇳', placeholder: '20 123 456' },
    { name: 'Yemen', code: 'YE', dialCode: '967', flag: '🇾🇪', placeholder: '771 234 567' },

    // Europe
    { name: 'Austria', code: 'AT', dialCode: '43', flag: '🇦🇹', placeholder: '664 1234567' },
    { name: 'Belgium', code: 'BE', dialCode: '32', flag: '🇧🇪', placeholder: '470 12 34 56' },
    { name: 'Denmark', code: 'DK', dialCode: '45', flag: '🇩🇰', placeholder: '20 12 34 56' },
    { name: 'France', code: 'FR', dialCode: '33', flag: '🇫🇷', placeholder: '6 12 34 56 78' },
    { name: 'Greece', code: 'GR', dialCode: '30', flag: '🇬🇷', placeholder: '691 234 5678' },
    { name: 'Ireland', code: 'IE', dialCode: '353', flag: '🇮🇪', placeholder: '85 123 4567' },
    { name: 'Italy', code: 'IT', dialCode: '39', flag: '🇮🇹', placeholder: '312 345 6789' },
    { name: 'Netherlands', code: 'NL', dialCode: '31', flag: '🇳🇱', placeholder: '6 12345678' },
    { name: 'Norway', code: 'NO', dialCode: '47', flag: '🇳🇴', placeholder: '412 34 567' },
    { name: 'Poland', code: 'PL', dialCode: '48', flag: '🇵🇱', placeholder: '512 345 678' },
    { name: 'Portugal', code: 'PT', dialCode: '351', flag: '🇵🇹', placeholder: '912 345 678' },
    { name: 'Russia', code: 'RU', dialCode: '7', flag: '🇷🇺', placeholder: '912 345-67-89' },
    { name: 'Spain', code: 'ES', dialCode: '34', flag: '🇪🇸', placeholder: '612 34 56 78' },
    { name: 'Sweden', code: 'SE', dialCode: '46', flag: '🇸🇪', placeholder: '70 123 45 67' },
    { name: 'Switzerland', code: 'CH', dialCode: '41', flag: '🇨🇭', placeholder: '78 123 45 67' },
    { name: 'Turkey', code: 'TR', dialCode: '90', flag: '🇹🇷', placeholder: '501 234 56 78' },
    { name: 'Ukraine', code: 'UA', dialCode: '380', flag: '🇺🇦', placeholder: '50 123 4567' },

    // Asia & Pacific
    { name: 'Australia', code: 'AU', dialCode: '61', flag: '🇦🇺', placeholder: '412 345 678' },
    { name: 'Bangladesh', code: 'BD', dialCode: '880', flag: '🇧🇩', placeholder: '1712-345678' },
    { name: 'China', code: 'CN', dialCode: '86', flag: '🇨🇳', placeholder: '131 2345 6789' },
    { name: 'India', code: 'IN', dialCode: '91', flag: '🇮🇳', placeholder: '98123 45678' },
    { name: 'Indonesia', code: 'ID', dialCode: '62', flag: '🇮🇩', placeholder: '812-345-678' },
    { name: 'Japan', code: 'JP', dialCode: '81', flag: '🇯🇵', placeholder: '90 1234 5678' },
    { name: 'Malaysia', code: 'MY', dialCode: '60', flag: '🇲🇾', placeholder: '12-345 6789' },
    { name: 'New Zealand', code: 'NZ', dialCode: '64', flag: '🇳🇿', placeholder: '21 123 4567' },
    { name: 'Pakistan', code: 'PK', dialCode: '92', flag: '🇵🇰', placeholder: '301 2345678' },
    { name: 'Philippines', code: 'PH', dialCode: '63', flag: '🇵🇭', placeholder: '917 123 4567' },
    { name: 'Singapore', code: 'SG', dialCode: '65', flag: '🇸🇬', placeholder: '8123 4567' },
    { name: 'South Korea', code: 'KR', dialCode: '82', flag: '🇰🇷', placeholder: '10-1234-5678' },

    // Americas
    { name: 'Argentina', code: 'AR', dialCode: '54', flag: '🇦🇷', placeholder: '9 11 1234-5678' },
    { name: 'Brazil', code: 'BR', dialCode: '55', flag: '🇧🇷', placeholder: '11 91234-5678' },
    { name: 'Chile', code: 'CL', dialCode: '56', flag: '🇨🇱', placeholder: '9 1234 5678' },
    { name: 'Colombia', code: 'CO', dialCode: '57', flag: '🇨🇴', placeholder: '300 123 4567' },
    { name: 'Mexico', code: 'MX', dialCode: '52', flag: '🇲🇽', placeholder: '55 1234 5678' },

    // Africa
    { name: 'Ethiopia', code: 'ET', dialCode: '251', flag: '🇪🇹', placeholder: '91 123 4567' },
    { name: 'Ghana', code: 'GH', dialCode: '233', flag: '🇬🇭', placeholder: '24 123 4567' },
    { name: 'Kenya', code: 'KE', dialCode: '254', flag: '🇰🇪', placeholder: '712 345678' },
    { name: 'Nigeria', code: 'NG', dialCode: '234', flag: '🇳🇬', placeholder: '802 123 4567' },
    { name: 'South Africa', code: 'ZA', dialCode: '27', flag: '🇿🇦', placeholder: '71 123 4567' },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

export function validatePhoneNumber(dialCode: string, nationalNumber: string): boolean {
    const digits = nationalNumber.replace(/\D/g, '');
    if (!digits) return false;

    // Specific country validations
    switch (dialCode) {
        case '20': // Egypt: 10 digits starting with 10, 11, 12, or 15
            return /^1[0125]\d{8}$/.test(digits);
        case '966': // Saudi Arabia: 9 digits starting with 5
            return /^5\d{8}$/.test(digits);
        case '971': // UAE: 9 digits starting with 5
            return /^5\d{8}$/.test(digits);
        case '965': // Kuwait: 8 digits starting with 5, 6, 9
            return /^[569]\d{7}$/.test(digits);
        case '974': // Qatar: 8 digits starting with 3, 5, 6, 7
            return /^[3567]\d{7}$/.test(digits);
        case '973': // Bahrain: 8 digits starting with 3, 6, 1
            return /^[136]\d{7}$/.test(digits);
        case '968': // Oman: 8 digits starting with 7, 9
            return /^[79]\d{7}$/.test(digits);
        case '962': // Jordan: 9 digits starting with 7
            return /^7[789]\d{7}$/.test(digits);
        case '1': // US/Canada: 10 digits
            return /^[2-9]\d{9}$/.test(digits);
        case '44': // UK: 10 digits
            return /^[1-9]\d{9}$/.test(digits);
        default: // General international E.164 rule: local digits between 4 and 14
            return digits.length >= 4 && digits.length <= 14;
    }
}
