package com.StudyMate.StudyMate.controller;


import com.StudyMate.StudyMate.dto.request.DecksRequest;
import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.DecksResponse;
import com.StudyMate.StudyMate.service.DecksService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/decks")
@RequiredArgsConstructor
public class DecksController {

    private final DecksService decksService;

    @PostMapping
    ApiResponse<DecksResponse> createDecks(@RequestBody List<FlashcardsRequest> flashcardsRequests,
                                           @RequestBody DecksRequest decksRequest){
        DecksResponse response = decksService.createDecks(flashcardsRequests, decksRequest);
        return ApiResponse.<DecksResponse>builder()
                .code(1000)
                .result(response)
                .build();
    }

    @GetMapping("/all")
    ApiResponse<List<DecksResponse>> getAllDecks(){
        List<DecksResponse> response = decksService.getAllDecks();
        return ApiResponse.<List<DecksResponse>>builder()
                .code(1000)
                .result(response)
                .build();
    }

}
