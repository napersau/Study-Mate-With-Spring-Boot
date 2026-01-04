package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.QuestionGroupResponse;
import com.StudyMate.StudyMate.service.QuestionGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/question-groups")
@RequiredArgsConstructor
public class QuestionGroupController {

    private final QuestionGroupService questionGroupService;

    @GetMapping
    ApiResponse<List<QuestionGroupResponse>> getAllQuestionGroupsByTypeAndHasExamIsNull(@RequestParam String type){
        List<QuestionGroupResponse> responses = questionGroupService.getAllQuestionGroupsByTypeAndHasExamIsNull(type);
        return ApiResponse.<List<QuestionGroupResponse>>builder()
                .code(1000)
                .result(responses)
                .message("Load all question groups successfully")
                .build();
    }
}
