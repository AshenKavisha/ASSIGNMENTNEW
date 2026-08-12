package com.assignmentservice.service;

import com.assignmentservice.dto.RecaptchaResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class RecaptchaService {

    @Value("${recaptcha.secret.key}")
    private String secretKey;

    private final RestTemplate restTemplate = new RestTemplate();

    private static final double SCORE_THRESHOLD = 0.5;
    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verify(String token) {
    if (token == null || token.isBlank()) {
        System.out.println("⚠️ Recaptcha token missing/blank");
        return false;
    }

    MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
    params.add("secret", secretKey);
    params.add("response", token);

    try {
        RecaptchaResponse response = restTemplate.postForObject(VERIFY_URL, params, RecaptchaResponse.class);

        if (response == null) {
            System.out.println("⚠️ Recaptcha: null response from Google");
            return false;
        }

        System.out.println("🔍 Recaptcha result: success=" + response.isSuccess()
                + " action=" + response.getAction()
                + " score=" + response.getScore()
                + " errors=" + response.getErrorCodes()); // add this getter if RecaptchaResponse has error-codes field

        if (!response.isSuccess()) return false;
        if (!"contact_submit".equals(response.getAction())) {
            System.out.println("⚠️ Recaptcha action mismatch, expected 'contact_submit' got '" + response.getAction() + "'");
            return false;
        }
        if (response.getScore() < SCORE_THRESHOLD) {
            System.out.println("⚠️ Recaptcha score too low: " + response.getScore());
            return false;
        }
        return true;

    } catch (Exception e) {
        System.err.println("❌ Recaptcha verify() threw: " + e.getClass() + " - " + e.getMessage());
        e.printStackTrace();
        return false;
    }
}
}