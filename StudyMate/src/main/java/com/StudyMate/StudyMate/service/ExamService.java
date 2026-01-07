package com.StudyMate.StudyMate.service;


import com.StudyMate.StudyMate.dto.request.ExamRequest;
import com.StudyMate.StudyMate.dto.response.ExamResponse;

import java.util.List;

public interface ExamService {
    List<ExamResponse> getAllExams();
    List<ExamResponse> getExamsByType(String examType);
    ExamResponse getExamById(Long id);
    ExamResponse updateExam(Long id, ExamRequest examRequest);
    ExamResponse createExam(ExamRequest examRequest);
    void deleteExam(Long id);
}
