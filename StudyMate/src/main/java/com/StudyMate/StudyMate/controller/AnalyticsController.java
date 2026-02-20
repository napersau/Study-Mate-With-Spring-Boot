package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.request.StudyTimeRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.DailyStudyStatResponse;
import com.StudyMate.StudyMate.dto.response.UserGamificationResponse;
import com.StudyMate.StudyMate.service.AnalyticsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
        List<DailyStudyStatResponse> response = analyticsService.getStudyStats(days);
        return ApiResponse.<List<DailyStudyStatResponse>>builder()
                .result(response)
                .code(1000)
                .message("Success")
                .build();
    }

    @PostMapping("/study-time")
    public ApiResponse<Void> recordStudyTime(@RequestBody @Valid StudyTimeRequest request) {
        analyticsService.recordStudyTime(request.getSeconds());

        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Lưu thời gian học thành công")
                .build();
    }

}
