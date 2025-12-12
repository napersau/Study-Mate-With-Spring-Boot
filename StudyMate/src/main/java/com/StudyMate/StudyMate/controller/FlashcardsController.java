package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;
import com.StudyMate.StudyMate.service.FlashcardsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/all")
    ApiResponse<List<FlashcardsResponse>> getAllFlashcards(){
        List<FlashcardsResponse> responses = flashcardsService.getAllFlashcards();
        return ApiResponse.<List<FlashcardsResponse>>builder()
                .code(1000)
                .result(responses)
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<FlashcardsResponse> getFlashcardsById(@PathVariable("id") Long id){
        return ApiResponse.<FlashcardsResponse>builder()
                .code(1000)
                .result(flashcardsService.getFlashcardsById(id))
                .build();
    }
}
