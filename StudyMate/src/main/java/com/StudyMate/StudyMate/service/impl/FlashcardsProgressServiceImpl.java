package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.request.FlashcardsProgressRequest;
import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.entity.FlashcardsProgress;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.enums.FlashcardStatus;
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

import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
    public FlashcardsProgressResponse updateFlashcardsProgress(
            Long flashcardsId,
            FlashcardsProgressRequest request) {

        User user = securityUtil.getCurrentUser();

        FlashcardsProgress progress =
                flashcardsProgressRepository
                        .findByUserIdAndFlashcardId(user.getId(), flashcardsId)
                        .orElseGet(() -> createNewProgress(user, flashcardsId));

        int box = progress.getBoxNumber() == null ? 1 : progress.getBoxNumber();

        switch (request.getJudge()) {

            case "hard" -> {
                progress.setBoxNumber(1);
                progress.setNextReviewAt(Instant.now().plus(1, ChronoUnit.DAYS));
                progress.setStatus(FlashcardStatus.LEARNING.name());
            }

            case "medium" -> {
                progress.setBoxNumber(Math.min(box + 1, 10));
                progress.setNextReviewAt(Instant.now().plus(3, ChronoUnit.DAYS));
                progress.setStatus(FlashcardStatus.LEARNING.name());
            }

            case "easy" -> {
                progress.setBoxNumber(Math.min(box + 2, 10));
                progress.setNextReviewAt(Instant.now().plus(7, ChronoUnit.DAYS));
                progress.setStatus(FlashcardStatus.REVIEW.name());
            }

            case "know" -> {
                progress.setBoxNumber(10);
                progress.setNextReviewAt(Instant.now().plus(30, ChronoUnit.DAYS));
                progress.setStatus(FlashcardStatus.SUSPENDED.name());
            }
        }

        progress.setLastReviewedAt(Instant.now());
        flashcardsProgressRepository.save(progress);

        return modelMapper.map(progress, FlashcardsProgressResponse.class);
    }


    private FlashcardsProgress createNewProgress(User user, Long flashcardId) {
        return FlashcardsProgress.builder()
                .user(user)
                .flashcard(flashcardsRepository.getReferenceById(flashcardId))
                .boxNumber(1)
                .status(FlashcardStatus.NEW.name())
                .build();
    }
}
