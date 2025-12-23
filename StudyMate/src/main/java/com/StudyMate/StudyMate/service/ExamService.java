package com.StudyMate.StudyMate.service;


import com.StudyMate.StudyMate.dto.response.ExamResponse;

import java.util.List;

public interface ExamService {
    List<ExamResponse> getAllExams();
    List<ExamResponse> getExamsByType(String examType);
    ExamResponse getExamById(Long id);
}
