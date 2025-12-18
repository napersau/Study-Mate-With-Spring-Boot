package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.FlashcardsProgressRequest;
import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;
import com.StudyMate.StudyMate.entity.FlashcardsProgress;

import java.util.List;

public interface FlashcardsProgressService {
    List<FlashcardsResponse> getFlashcardsDueToday();
    FlashcardsProgressResponse updateFlashcardsProgress(Long flashcardsId, FlashcardsProgressRequest flashcardsProgressRequest);
}
