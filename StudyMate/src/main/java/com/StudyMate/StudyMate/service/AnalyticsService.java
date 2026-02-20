package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.response.DailyStudyStatResponse;
import com.StudyMate.StudyMate.dto.response.UserGamificationResponse;

import java.util.List;

public interface AnalyticsService {

    void recordDailyActivity(Long userId);
    UserGamificationResponse getUserGamification();
    List<DailyStudyStatResponse> getStudyStats(int lastDays);
    void recordStudyTime(Long seconds);
}
