package com.StudyMate.StudyMate.dto.request;

import com.StudyMate.StudyMate.dto.response.QuestionGroupResponse;
import com.StudyMate.StudyMate.enums.ExamType;
import lombok.Data;

import java.util.List;

@Data
public class ExamRequest {
    private String title; // VD: ETS 2024 - Test 1
    private String description;
    private Integer duration; // Thời gian tính bằng phút (VD: 120)
    private ExamType type;
    private Integer totalQuestions; // Tổng số câu (VD: 200)
    private List<QuestionGroupRequest> questionGroups;
}
