package com.StudyMate.StudyMate.dto.response;

import lombok.Data;

import java.time.Instant;

@Data
public class UserStudyStatsResponse {
    private Long id;
    private UserResponse user;
    private Instant studyDate;
    private Long durationSeconds;
}
