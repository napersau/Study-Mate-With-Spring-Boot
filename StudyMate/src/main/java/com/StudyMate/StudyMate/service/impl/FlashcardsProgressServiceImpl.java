package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.request.FlashcardsProgressRequest;
import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;
import com.StudyMate.StudyMate.dto.response.MediaResponse;
import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.entity.FlashcardsProgress;
import com.StudyMate.StudyMate.entity.Media;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.enums.FlashcardStatus;
import com.StudyMate.StudyMate.exception.AppException;
import com.StudyMate.StudyMate.exception.ErrorCode;
import com.StudyMate.StudyMate.repository.FlashcardsProgressRepository;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.StudyMate.StudyMate.repository.MediaRepository;
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
    private final MediaRepository mediaRepository;

    @Override
    public List<FlashcardsResponse> getFlashcardsDueToday() {

        User user = securityUtil.getCurrentUser();

        List<FlashcardsProgress> dueList =
                flashcardsProgressRepository.findDueFlashcards(
                        user.getId(),
                        Instant.now()
                );

        return dueList.stream().map(progress -> {
            FlashcardsResponse fc =
                    modelMapper.map(progress.getFlashcard(), FlashcardsResponse.class);

            fc.setFlashcardsProgress(
                    modelMapper.map(progress, FlashcardsProgressResponse.class)
            );

            // gán media
            List<Media> mediaList = mediaRepository
                    .findBySourceTypeAndSourceIdIn("flashcards", List.of(progress.getFlashcard().getId()));
            fc.setMediaList(mediaList.stream()
                    .map(m -> modelMapper.map(m, MediaResponse.class))
                    .toList());

            return fc;
        }).toList();
    }


    @Override
    public FlashcardsProgressResponse updateFlashcardsProgress(Long flashcardsId, FlashcardsProgressRequest request) {

        User user = securityUtil.getCurrentUser();

        FlashcardsProgress progress =
                flashcardsProgressRepository.findByUserIdAndFlashcardId(user.getId(), flashcardsId)
                        .orElseGet(() -> createNewProgress(user, flashcardsId));

        int q = mapJudgeToQuality(request.getJudge());
        applySM2(progress, q);

        progress.setLastReviewedAt(Instant.now());
        progress.setStatus(q < 3 ? FlashcardStatus.LEARNING.name() : FlashcardStatus.REVIEW.name());

        flashcardsProgressRepository.save(progress);

        return modelMapper.map(progress, FlashcardsProgressResponse.class);
    }

    private void applySM2(FlashcardsProgress p, int q) {

        double EF = p.getEasinessFactor() == null ? 2.5 : p.getEasinessFactor();
        int repetitions = p.getRepetitions() == null ? 0 : p.getRepetitions();
        int interval = p.getInterval() == null ? 0 : p.getInterval();

        // ------------------------------------------------
        // Update Easiness Factor
        // ------------------------------------------------
        EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
        if (EF < 1.3) EF = 1.3;
        p.setEasinessFactor(EF);

        // ------------------------------------------------
        // If answered wrong (quality < 3)
        // ------------------------------------------------
        if (q < 3) {
            p.setRepetitions(0);
            p.setInterval(1);
        } else {

            if (repetitions == 0) {
                interval = 1;
            } else if (repetitions == 1) {
                interval = 6;
            } else {
                interval = (int) Math.round(interval * EF);
            }

            repetitions++;
            p.setRepetitions(repetitions);
            p.setInterval(interval);
        }

        // next review date
        p.setNextReviewAt(Instant.now().plus(interval, ChronoUnit.DAYS));
    }

    private int mapJudgeToQuality(String judge) {
        return switch (judge.toLowerCase()) {
            case "again" -> 0;   // quên hoàn toàn
            case "hard"  -> 3;   // hơi nhớ
            case "good"  -> 4;   // nhớ tốt
            case "easy"  -> 5;   // nhớ rất tốt
            default -> 3;
        };
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
