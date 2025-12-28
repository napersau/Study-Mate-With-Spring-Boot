package com.StudyMate.StudyMate.controller;


import com.StudyMate.StudyMate.dto.request.ExamResultRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.ExamResultResponse;
import com.StudyMate.StudyMate.service.ExamResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/exam-results")
@RequiredArgsConstructor
public class ExamResultController {

    private final ExamResultService examResultService;

    @PostMapping
    ApiResponse<ExamResultResponse> createExamResult(@RequestBody ExamResultRequest examResultRequest){
        ExamResultResponse response = examResultService.createExamResult(examResultRequest);
        return ApiResponse.<ExamResultResponse>builder()
                .result(response)
                .code(1000)
                .message("Exam result created successfully")
                .build();
    }

}
