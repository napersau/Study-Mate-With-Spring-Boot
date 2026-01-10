package com.StudyMate.StudyMate.dto.request;

import com.StudyMate.StudyMate.entity.User;
import jakarta.persistence.Column;
import lombok.Data;

import java.time.Instant;

@Data
public class UserStudyStatsRequest {
    private Instant studyDate;
    private Long durationSeconds;
}
