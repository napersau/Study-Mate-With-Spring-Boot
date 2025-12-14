package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.entity.FlashcardsProgress;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.exception.AppException;
import com.StudyMate.StudyMate.exception.ErrorCode;
import com.StudyMate.StudyMate.repository.FlashcardsProgressRepository;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.StudyMate.StudyMate.service.FlashcardsProgressService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FlashcardsProgressServiceImpl implements FlashcardsProgressService {

    private final FlashcardsProgressRepository flashcardsProgressRepository;
    private final ModelMapper modelMapper;
    private final SecurityUtil securityUtil;
    private final FlashcardsRepository flashcardsRepository;

    @Override
    public List<FlashcardsProgressResponse> getFlashcardsProgress() {

        User user = securityUtil.getCurrentUser();

        List<FlashcardsProgress> flashcardsProgressList = flashcardsProgressRepository.findByUserId(user.getId());
        return flashcardsProgressList.stream()
                .map(flashcardsProgress -> modelMapper.map(flashcardsProgress, FlashcardsProgressResponse.class))
                .toList();
    }

    @Override
    public FlashcardsProgressResponse createFlashcardsProgress(Long flashcardId) {

        User user = securityUtil.getCurrentUser();
        Flashcards flashcards = flashcardsRepository.findById(flashcardId)
                .orElseThrow(() -> new AppException(ErrorCode.FLASHCARDS_NOT_FOUND));
        FlashcardsProgress flashcardsProgress = FlashcardsProgress.builder()
                .flashcard(flashcards)
                .user(user)
                .build();

        return modelMapper.map(flashcardsProgressRepository.save(flashcardsProgress), FlashcardsProgressResponse.class);
    }

    @Override
    public FlashcardsProgressResponse updateFlashcardsProgress(Long id, FlashcardsProgress flashcardsProgress) {
        FlashcardsProgress flashcardsProgressResponse = flashcardsProgressRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flashcard not found"));
        flashcardsProgress.setBoxNumber(flashcardsProgressResponse.getBoxNumber());
        flashcardsProgress.setStatus(flashcardsProgressResponse.getStatus());
        flashcardsProgress.setNextReviewAt(flashcardsProgressResponse.getNextReviewAt());
        flashcardsProgress.setLastReviewedAt(flashcardsProgressResponse.getLastReviewedAt());
        flashcardsProgressRepository.save(flashcardsProgress);

        return modelMapper.map(flashcardsProgress, FlashcardsProgressResponse.class);
    }
}
