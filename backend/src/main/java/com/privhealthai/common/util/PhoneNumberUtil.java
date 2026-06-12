package com.privhealthai.common.util;

import com.privhealthai.exception.PhoneValidationException;

public class PhoneNumberUtil {

    private PhoneNumberUtil() {
        // Utility class
    }

    /**
     * Normalizes and validates an Indian phone number.
     * Removes spaces, hyphens, and brackets.
     * Converts to E.164 format: +91[6-9]XXXXXXXXX
     *
     * @param phone The raw phone number string
     * @return The normalized E.164 phone number
     * @throws PhoneValidationException if the phone number is invalid
     */
    public static String normalizeIndianPhone(String phone) {
        if (phone == null || phone.isBlank()) {
            throw new PhoneValidationException("Phone number cannot be empty");
        }

        // Step 1: Remove spaces, hyphens, brackets
        String cleaned = phone.replaceAll("[\\s\\-\\(\\)]", "");

        // Step 2: Validate the pattern and normalize
        // Case A: 10 digits starting with 6-9
        if (cleaned.matches("^[6-9]\\d{9}$")) {
            return "+91" + cleaned;
        }
        // Case B: 11 digits starting with 0 followed by 6-9
        if (cleaned.matches("^0[6-9]\\d{9}$")) {
            return "+91" + cleaned.substring(1);
        }
        // Case C: starts with +91 followed by 10 digits starting with 6-9
        if (cleaned.matches("^\\+91[6-9]\\d{9}$")) {
            return cleaned;
        }
        // Case D: starts with 91 followed by 10 digits starting with 6-9
        if (cleaned.matches("^91[6-9]\\d{9}$")) {
            return "+" + cleaned;
        }

        // If it doesn't match any of the above, it's invalid
        throw new PhoneValidationException("Invalid Indian mobile number");
    }
}
