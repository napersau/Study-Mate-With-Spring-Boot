package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.dto.request.ExamResultRequest;
import com.StudyMate.StudyMate.dto.response.ExamResultResponse;
import com.StudyMate.StudyMate.service.ExamResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ExamResultServiceImpl implements ExamResultService {
    @Override
    public ExamResultResponse createExamResult(ExamResultRequest examResultRequest) {
        return null;
    }
}
