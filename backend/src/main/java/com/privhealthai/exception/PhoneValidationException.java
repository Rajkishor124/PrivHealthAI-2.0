package com.privhealthai.exception;

import org.springframework.http.HttpStatus;

public class PhoneValidationException extends ApiException {

    public PhoneValidationException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }
}
