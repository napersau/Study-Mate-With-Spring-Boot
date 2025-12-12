package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;
import com.StudyMate.StudyMate.dto.response.MediaResponse;
import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.entity.Media;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.StudyMate.StudyMate.repository.MediaRepository;
import com.StudyMate.StudyMate.service.FlashcardsService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FlashcardsServiceImpl implements FlashcardsService {

    private final FlashcardsRepository flashcardsRepository;
    private final ModelMapper modelMapper;
    private final MediaRepository mediaRepository;

    @Override
    public FlashcardsResponse createFlashcards(FlashcardsRequest flashcardsRequest) {

        List<Media> mediaEntities = flashcardsRequest.getMediaList().stream()
                .map(mediaRequest -> modelMapper.map(mediaRequest, Media.class))
                .collect(Collectors.toList());
        List<Media> savedMediaList = mediaRepository.saveAll(mediaEntities);


        Flashcards flashcards = Flashcards.builder()
                .term(flashcardsRequest.getTerm())
                .definition(flashcardsRequest.getDefinition())
                .pronunciation(flashcardsRequest.getPronunciation())
                .example(flashcardsRequest.getExample())
                .mediaList(savedMediaList)
                .build();

        return modelMapper.map(flashcardsRepository.save(flashcards), FlashcardsResponse.class);
    }
}
