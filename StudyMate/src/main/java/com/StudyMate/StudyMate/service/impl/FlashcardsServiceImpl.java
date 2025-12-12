package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;
import com.StudyMate.StudyMate.dto.response.MediaResponse;
import com.StudyMate.StudyMate.entity.Flashcards;
import com.StudyMate.StudyMate.entity.Media;
import com.StudyMate.StudyMate.exception.AppException;
import com.StudyMate.StudyMate.exception.ErrorCode;
import com.StudyMate.StudyMate.repository.FlashcardsRepository;
import com.StudyMate.StudyMate.repository.MediaRepository;
import com.StudyMate.StudyMate.service.FlashcardsService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
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

        Flashcards flashcards = Flashcards.builder()
                .term(flashcardsRequest.getTerm())
                .definition(flashcardsRequest.getDefinition())
                .pronunciation(flashcardsRequest.getPronunciation())
                .example(flashcardsRequest.getExample())
                .build();

        flashcardsRepository.save(flashcards);

        List<Media> mediaEntities = flashcardsRequest.getMediaList().stream()
                .map(mediaRequest -> {
                    Media media = modelMapper.map(mediaRequest, Media.class);
                    media.setSourceId(flashcards.getId()); // Set sourceId từ flashcards ID
                    media.setCreatedDate(Instant.now()); // Set thời gian tạo
                    return media;
                })
                .toList();

        return modelMapper.map(flashcards, FlashcardsResponse.class);
    }

    @Override
    public List<FlashcardsResponse> getAllFlashcards() {
        List<Flashcards> flashcardsList = flashcardsRepository.findAll();
        return flashcardsList.stream()
                .map(flashcards -> modelMapper.map(flashcards, FlashcardsResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public FlashcardsResponse getFlashcardsById(Long id) {
        Flashcards flashcards = flashcardsRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.FLASHCARDS_NOT_FOUND));
        return modelMapper.map(flashcards, FlashcardsResponse.class);
    }
}
