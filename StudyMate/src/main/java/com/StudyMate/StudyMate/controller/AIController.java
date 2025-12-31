package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/chat")
    public ApiResponse<String> chat(@RequestBody Map<String, String> request) {
        String message = request.get("message");
        return ApiResponse.<String>builder()
                .result(aiService.chatWithAI(message))
                .build();
    }

    @PostMapping("/translate")
    public ApiResponse<String> translate(@RequestBody Map<String, String> request) {
        String text = request.get("text");
        return ApiResponse.<String>builder()
                .result(aiService.translateText(text))
                .build();
    }
}