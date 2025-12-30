package com.StudyMate.StudyMate.dto.request;

import com.StudyMate.StudyMate.entity.ExamResult;
import lombok.Data;

@Data
public class ExamResultDetailRequest {
    private String selectedOption; // User chọn gì: A, B, C, D (hoặc null nếu bỏ qua)
    private boolean isCorrect; // Đúng hay sai
    private ExamResult examResult;
    private QuestionRequest question;
}
