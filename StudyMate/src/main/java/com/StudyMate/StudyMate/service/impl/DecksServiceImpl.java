package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.request.DecksRequest;
import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.DecksResponse;
import com.StudyMate.StudyMate.entity.Decks;
import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.repository.DecksRepository;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.StudyMate.StudyMate.service.DecksService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DecksServiceImpl implements DecksService {

    private final FlashcardsRepository flashcardsRepository;
    private final DecksRepository decksRepository;
    private final ModelMapper modelMapper;

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
}
