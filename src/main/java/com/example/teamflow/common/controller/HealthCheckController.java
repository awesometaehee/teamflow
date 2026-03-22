package com.example.teamflow.common.controller;

import com.example.teamflow.common.response.HealthCheckResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @GetMapping
    public HealthCheckResponse health() {
        return new HealthCheckResponse("UP");
    }
}
