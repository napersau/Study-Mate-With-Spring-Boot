package com.StudyMate.StudyMate.controller;


import com.StudyMate.StudyMate.dto.request.FlashcardsProgressRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;
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

    @GetMapping("/due")
    ApiResponse<List<FlashcardsResponse>> getDueFlashcards(){
        List<FlashcardsResponse> responses = flashcardsProgressService.getFlashcardsDueToday();
        return ApiResponse.<List<FlashcardsResponse>>builder()
                .code(1000)
                .result(responses)
                .build();
    }


    @PutMapping("/{flashcardId}")
    ApiResponse<FlashcardsProgressResponse> updateFlashcardsProgress(@PathVariable("flashcardsId") Long flashcardsId,
                                                                     @RequestBody FlashcardsProgressRequest flashcardsProgressRequest){
        FlashcardsProgressResponse response = flashcardsProgressService.updateFlashcardsProgress(flashcardsId, flashcardsProgressRequest);
        return ApiResponse.<FlashcardsProgressResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }
}
