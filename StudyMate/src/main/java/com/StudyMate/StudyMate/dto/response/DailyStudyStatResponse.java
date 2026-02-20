package com.StudyMate.StudyMate.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class DailyStudyStatResponse {
    private LocalDate date;      // Ngày (VD: 2024-02-18)
    private boolean hasLearned;  // true: có học, false: không học
    private Long durationSeconds;
}
