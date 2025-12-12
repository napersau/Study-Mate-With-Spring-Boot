package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;
import com.StudyMate.StudyMate.service.FlashcardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/flashcards")
@RequiredArgsConstructor
public class FlashcardsController {

    private final FlashcardsService flashcardsService;

    @PostMapping
    ApiResponse<FlashcardsResponse> createFlashcards(@RequestBody FlashcardsRequest flashcardsRequest){
        FlashcardsResponse response = flashcardsService.createFlashcards(flashcardsRequest);
        return ApiResponse.<FlashcardsResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }
}
