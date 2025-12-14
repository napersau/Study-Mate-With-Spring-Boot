package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.entity.FlashcardsProgress;

import java.util.List;

public interface FlashcardsProgressService {
    List<FlashcardsProgressResponse> getFlashcardsProgress();
    FlashcardsProgressResponse createFlashcardsProgress(Long flashcardId);
    FlashcardsProgressResponse updateFlashcardsProgress(Long id, FlashcardsProgress flashcardsProgress);
}
