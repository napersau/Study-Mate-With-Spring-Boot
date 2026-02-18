package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.response.UserGamificationResponse;

public interface AnalyticsService {

    void recordDailyActivity(Long userId);

}
