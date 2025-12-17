package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.request.DecksRequest;
import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.DecksResponse;
import com.StudyMate.StudyMate.dto.response.MediaResponse;
import com.StudyMate.StudyMate.entity.Decks;
import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.entity.Media;
import com.StudyMate.StudyMate.repository.DecksRepository;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.StudyMate.StudyMate.repository.MediaRepository;
import com.StudyMate.StudyMate.service.DecksService;
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
        Decks decks = decksRepository.findById(id).orElse(null);
        // flashcards đã được JPA load
        List<Flashcards> flashcards = decks.getFlashcardsList();
        // lấy id flashcard
        List<Long> flashcardIds = flashcards.stream()
                .map(Flashcards::getId)
                .toList();
        // lấy audio 1 lần
        List<Media> medias = mediaRepository
                .findBySourceTypeAndSourceIdIn("flashcards", flashcardIds);

        Map<Long, List<Media>> mediaMap = medias.stream()
                .collect(Collectors.groupingBy(Media::getSourceId));

        DecksResponse response = modelMapper.map(decks, DecksResponse.class);
        // gán audio vào flashcard response
        response.getFlashcardsList().forEach(fc -> {
            List<Media> audioList = mediaMap.get(fc.getId());
            if (audioList != null) {
                fc.setMediaList(
                        audioList.stream()
                                .map(media -> modelMapper.map(media, MediaResponse.class))
                                .toList()
                );
            }
        });
        return response;
    }
}
