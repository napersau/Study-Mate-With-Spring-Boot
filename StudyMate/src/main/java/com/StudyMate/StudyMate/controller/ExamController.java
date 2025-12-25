package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.request.ExamRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.ExamResponse;
import com.StudyMate.StudyMate.service.ExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/exams")
public class ExamController {

    private final ExamService examService;

    @GetMapping
    ApiResponse<List<ExamResponse>> getAllExams() {
        List<ExamResponse> responses = examService.getAllExams();
        return ApiResponse.<List<ExamResponse>>builder()
                .code(1000)
                .result(responses)
                .message("Load all exams successfully")
                .build();
    }

    @GetMapping("/type" )
    ApiResponse<List<ExamResponse>> getExamsByType(@RequestParam String examType) {
        List<ExamResponse> responses = examService.getExamsByType(examType);
        return ApiResponse.<List<ExamResponse>>builder()
                .code(1000)
                .result(responses)
                .message("Load exams by type successfully")
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<ExamResponse> getExamById(@PathVariable Long id) {
        ExamResponse response = examService.getExamById(id);
        return ApiResponse.<ExamResponse>builder()
                .code(1000)
                .result(response)
                .message("Load exam by id successfully")
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<ExamResponse> updateExam(@PathVariable Long id, @RequestBody ExamRequest examRequest) {
        ExamResponse response = examService.updateExam(id, examRequest);
        return ApiResponse.<ExamResponse>builder()
                .code(1000)
                .result(response)
                .message("Update exam successfully")
                .build();
    }

}
