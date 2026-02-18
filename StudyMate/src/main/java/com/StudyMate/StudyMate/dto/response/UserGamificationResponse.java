package com.StudyMate.StudyMate.dto.response;

import jakarta.persistence.Column;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UserGamificationResponse {
    private Long userId;
    private Integer currentStreak = 0;
    private Integer longestStreak = 0;
    private Instant lastLearnDate;
    private boolean isLearnedToday;
}
