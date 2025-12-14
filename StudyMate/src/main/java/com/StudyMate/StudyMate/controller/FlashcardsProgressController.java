package com.StudyMate.StudyMate.controller;


import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.entity.FlashcardsProgress;
import com.StudyMate.StudyMate.service.FlashcardsProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/flashcards-progress")
@RequiredArgsConstructor
public class FlashcardsProgressController {

    private final FlashcardsProgressService flashcardsProgressService;

    @GetMapping
    ApiResponse<List<FlashcardsProgressResponse>> getAllFlashcardsProgress(){
        List<FlashcardsProgressResponse> responses = flashcardsProgressService.getFlashcardsProgress();
        return ApiResponse.<List<FlashcardsProgressResponse>>builder()
                .code(1000)
                .result(responses)
                .build();
    }

    @PostMapping("/{flashcardsId}")
    ApiResponse<FlashcardsProgressResponse> createFlashcardsProgress(@PathVariable("flashcardsId") Long flashcardsId){
        FlashcardsProgressResponse response = flashcardsProgressService.createFlashcardsProgress(flashcardsId);
        return ApiResponse.<FlashcardsProgressResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }

    @PutMapping("/{flashcardId}")
    ApiResponse<FlashcardsProgressResponse> updateFlashcardsProgress(@PathVariable("flashcardsId") Long flashcardsId,
                                                                     @RequestBody FlashcardsProgress flashcardsProgress){
        FlashcardsProgressResponse response = flashcardsProgressService.updateFlashcardsProgress(flashcardsId, flashcardsProgress);
        return ApiResponse.<FlashcardsProgressResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }
}
