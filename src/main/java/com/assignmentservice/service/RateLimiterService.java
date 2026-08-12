package com.assignmentservice.service;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimiterService {

    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();

    public boolean tryConsume(String ip) {
        Bucket bucket = buckets.computeIfAbsent(ip, k -> newBucket());
        return bucket.tryConsume(1);
    }

    private Bucket newBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofHours(1)));
        return Bucket.builder().addLimit(limit).build();
    }
}