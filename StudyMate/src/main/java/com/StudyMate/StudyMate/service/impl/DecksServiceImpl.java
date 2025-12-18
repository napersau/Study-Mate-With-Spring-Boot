package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.request.DecksRequest;
import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.DecksResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.dto.response.MediaResponse;
import com.StudyMate.StudyMate.entity.*;
import com.StudyMate.StudyMate.repository.DecksRepository;
import com.StudyMate.StudyMate.repository.FlashcardsProgressRepository;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.StudyMate.StudyMate.repository.MediaRepository;
import com.StudyMate.StudyMate.service.DecksService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DecksServiceImpl implements DecksService {

    private final FlashcardsRepository flashcardsRepository;
    private final DecksRepository decksRepository;
    private final ModelMapper modelMapper;
    private final MediaRepository mediaRepository;
    private final SecurityUtil securityUtil;
    private final FlashcardsProgressRepository flashcardsProgressRepository;

    @Override
    public DecksResponse createDecks(List<FlashcardsRequest> flashcardsRequests, DecksRequest decksRequest) {

        List<Flashcards> flashcardsList = flashcardsRepository.findAllById(flashcardsRequests
                .stream().map(FlashcardsRequest::getId).toList());

        Decks decks = Decks.builder()
                .flashcardsList(flashcardsList)
                .totalFlashcards(flashcardsList.size())
                .title(decksRequest.getTitle())
                .description(decksRequest.getDescription())
                .isPublic(true)
                .createdAt(Instant.now())
                .build();

        return modelMapper.map(decksRepository.save(decks), DecksResponse.class);
    }

    @Override
    public List<DecksResponse> getAllDecks() {

        List<Decks> decksList = decksRepository.findAll();
        return decksList.stream()
                .map(decks -> modelMapper.map(decks, DecksResponse.class)).toList();
    }

    @Override
    public DecksResponse getDeckById(Long id) {

        User user = securityUtil.getCurrentUser();

        Decks decks = decksRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Deck not found"));

        List<Flashcards> flashcards = decks.getFlashcardsList();

        List<Long> ids = flashcards.stream().map(Flashcards::getId).toList();

        // Progress
        Map<Long, FlashcardsProgress> progressMap = flashcardsProgressRepository
                .findByUserIdAndFlashcardIdIn(user.getId(), ids)
                .stream().collect(Collectors.toMap(
                        p -> p.getFlashcard().getId(), p -> p
                ));

        // Media
        Map<Long, List<Media>> mediaMap = mediaRepository
                .findBySourceTypeAndSourceIdIn("flashcards", ids)
                .stream().collect(Collectors.groupingBy(Media::getSourceId));

        // Build response
        DecksResponse response = modelMapper.map(decks, DecksResponse.class);

        response.getFlashcardsList().forEach(fc -> {

            // --- media ---
            List<Media> m = mediaMap.get(fc.getId());
            if (m != null) {
                fc.setMediaList(
                        m.stream().map(mm -> modelMapper.map(mm, MediaResponse.class)).toList()
                );
            }

            // --- progress ---
            FlashcardsProgress p = progressMap.get(fc.getId());
            if (p != null) {
                fc.setFlashcardsProgress(modelMapper.map(p, FlashcardsProgressResponse.class));
            } else {
                // Flashcard NEW
                FlashcardsProgressResponse newP = new FlashcardsProgressResponse();
                newP.setStatus("NEW");
                newP.setBoxNumber(1);
                fc.setFlashcardsProgress(newP);
            }
        });

        return response;
    }
}
