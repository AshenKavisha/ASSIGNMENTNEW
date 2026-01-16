package com.assignmentservice.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PolicyController {

    @GetMapping("/privacy")
    public String privacyPolicy() {
        return "privacy-policy";
    }

    @GetMapping("/terms")
    public String termsAndConditions() {
        return "terms-and-conditions";
    }

    @GetMapping("/refund")
    public String refundPolicy() {
        return "return-policy";
    }

    // Alternative routes (in case you want both)
    @GetMapping("/privacy-policy")
    public String privacyPolicyAlt() {
        return "privacy-policy";
    }

    @GetMapping("/terms-and-conditions")
    public String termsAndConditionsAlt() {
        return "terms-and-conditions";
    }

    @GetMapping("/return-policy")
    public String returnPolicyAlt() {
        return "return-policy";
    }
}