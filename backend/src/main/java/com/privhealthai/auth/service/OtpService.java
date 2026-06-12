package com.privhealthai.auth.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class OtpService {

    private static final String MOCK_OTP = "123456";

    private final ConcurrentHashMap<String, String> store = new ConcurrentHashMap<>();

    public void generate(String phone) {
        store.put(phone, MOCK_OTP);
        log.info("[DEV] OTP for {}: {}", phone, MOCK_OTP);
    }

    public boolean validate(String phone, String otp) {
        String stored = store.get(phone);
        if (stored != null && stored.equals(otp)) {
            store.remove(phone);
            return true;
        }
        return false;
    }

    public boolean hasPending(String phone) {
        return store.containsKey(phone);
    }
}
