package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.UserGamificationResponse;
import com.StudyMate.StudyMate.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    ApiResponse<UserGamificationResponse> getUserGamification() {
        UserGamificationResponse response = analyticsService.getUserGamification();
        return ApiResponse.<UserGamificationResponse>builder()
                .result(response)
                .code(1000)
                .message("Get user gamification successfully")
                .build();
    }

}
