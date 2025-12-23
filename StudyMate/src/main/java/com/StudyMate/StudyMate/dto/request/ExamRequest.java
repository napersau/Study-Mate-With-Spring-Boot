package com.StudyMate.StudyMate.dto.request;

import com.StudyMate.StudyMate.dto.response.QuestionGroupResponse;
import com.StudyMate.StudyMate.enums.ExamType;
import lombok.Data;

import java.util.List;

@Data
public class ExamRequest {
    private String title; // VD: ETS 2024 - Test 1
    private ExamType type;
}
