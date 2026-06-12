package com.privhealthai.common.util;

import com.privhealthai.exception.PhoneValidationException;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class PhoneNumberUtilTest {

    @Test
    void testValidIndianPhoneNumbers() {
        String expected = "+919334456119";
        
        assertEquals(expected, PhoneNumberUtil.normalizeIndianPhone("9334456119"));
        assertEquals(expected, PhoneNumberUtil.normalizeIndianPhone("09334456119"));
        assertEquals(expected, PhoneNumberUtil.normalizeIndianPhone("+919334456119"));
        assertEquals(expected, PhoneNumberUtil.normalizeIndianPhone("919334456119"));
        
        // With spaces and hyphens
        assertEquals(expected, PhoneNumberUtil.normalizeIndianPhone("91-9334456119"));
        assertEquals(expected, PhoneNumberUtil.normalizeIndianPhone("+91 93344 56119"));
        assertEquals(expected, PhoneNumberUtil.normalizeIndianPhone("91 93344 56119"));
        assertEquals(expected, PhoneNumberUtil.normalizeIndianPhone("(0) 93344-56119"));
    }

    @Test
    void testInvalidIndianPhoneNumbers() {
        assertThrows(PhoneValidationException.class, () -> PhoneNumberUtil.normalizeIndianPhone("12345"));
        assertThrows(PhoneValidationException.class, () -> PhoneNumberUtil.normalizeIndianPhone("777777"));
        assertThrows(PhoneValidationException.class, () -> PhoneNumberUtil.normalizeIndianPhone("+441234567890"));
        assertThrows(PhoneValidationException.class, () -> PhoneNumberUtil.normalizeIndianPhone("+12025550123"));
        assertThrows(PhoneValidationException.class, () -> PhoneNumberUtil.normalizeIndianPhone(null));
        assertThrows(PhoneValidationException.class, () -> PhoneNumberUtil.normalizeIndianPhone(""));
        assertThrows(PhoneValidationException.class, () -> PhoneNumberUtil.normalizeIndianPhone("   "));
        
        // Starts with 5 (invalid in India)
        assertThrows(PhoneValidationException.class, () -> PhoneNumberUtil.normalizeIndianPhone("5334456119"));
    }
}
