package com.StudyMate.StudyMate.dto.response;

import jakarta.persistence.Column;
import lombok.Data;

import java.time.Instant;

@Data
public class UserGamificationResponse {
    private Long userId;
    private Integer currentStreak = 0;
    private Integer longestStreak = 0;
    private Instant lastLearnDate;
}
