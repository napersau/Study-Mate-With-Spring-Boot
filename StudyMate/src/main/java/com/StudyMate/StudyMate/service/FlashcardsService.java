package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;

import java.util.List;

public interface FlashcardsService {
    FlashcardsResponse createFlashcards(FlashcardsRequest flashcardsRequest);
    List<FlashcardsResponse> getAllFlashcards();
    FlashcardsResponse getFlashcardsById(Long id);
}
