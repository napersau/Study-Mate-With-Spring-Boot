package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;

public interface FlashcardsService {
    FlashcardsResponse createFlashcards(FlashcardsRequest flashcardsRequest);
}
