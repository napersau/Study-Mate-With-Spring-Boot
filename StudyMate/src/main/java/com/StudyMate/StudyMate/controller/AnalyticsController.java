package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.DailyStudyStatResponse;
import com.StudyMate.StudyMate.dto.response.UserGamificationResponse;
import com.StudyMate.StudyMate.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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

    @GetMapping("/stats")
    ApiResponse<List<DailyStudyStatResponse>> getStudyStats(
            @RequestParam(defaultValue = "7") int days) {
        return ApiResponse.<List<DailyStudyStatResponse>>builder()
                .result(analyticsService.getStudyStats(days))
                .code(1000)
                .message("Success")
                .build();
    }

}
