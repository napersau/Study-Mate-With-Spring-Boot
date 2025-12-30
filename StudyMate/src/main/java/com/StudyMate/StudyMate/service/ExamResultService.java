package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.ExamResultRequest;
import com.StudyMate.StudyMate.dto.response.ExamResultResponse;

public interface ExamResultService {
    ExamResultResponse createExamResult(ExamResultRequest examResultRequest);
    ExamResultResponse getExamResultById(Long id);
}
