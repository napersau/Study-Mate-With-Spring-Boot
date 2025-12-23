package com.StudyMate.StudyMate.dto.response;


import com.StudyMate.StudyMate.enums.ExamType;
import lombok.Data;
import java.util.List;

@Data
public class ExamResponse {
    private Long id;
    private String title; // VD: ETS 2024 - Test 1
    private String description;
    private Integer duration; // Thời gian tính bằng phút (VD: 120)
    private ExamType type;
    private Integer totalQuestions; // Tổng số câu (VD: 200)
    private List<QuestionGroupResponse> questionGroups;
}
