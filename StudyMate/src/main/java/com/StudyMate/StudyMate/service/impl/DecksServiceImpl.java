package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.request.DecksRequest;
import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.DecksResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsProgressResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;
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
import java.util.Collections;
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
    public DecksResponse getDeckById(Long deckId) {
        User user = securityUtil.getCurrentUser();

        // 1. Validate & Get Deck
        Decks deck = getDeckOrThrow(deckId);

        // 2. Get & Shuffle Cards
        List<Flashcards> cardsToLearn = getCardsToLearn(deckId, user.getId());

        // 3. Prepare Data Maps (Tối ưu query N+1)
        List<Long> cardIds = cardsToLearn.stream().map(Flashcards::getId).toList();
        Map<Long, FlashcardsProgress> progressMap = getProgressMap(user.getId(), cardIds);
        Map<Long, List<Media>> mediaMap = getMediaMap(cardIds);

        // 4. Map to DTOs & Return
        return buildDecksResponse(deck, cardsToLearn, progressMap, mediaMap);
    }

    private Decks getDeckOrThrow(Long deckId) {
        return decksRepository.findById(deckId)
                .orElseThrow(() -> new RuntimeException("Deck not found with id: " + deckId));
    }

    private List<Flashcards> getCardsToLearn(Long deckId, Long userId) {
        List<Flashcards> cards = flashcardsRepository.findCardsToLearn(deckId, userId);
        Collections.shuffle(cards); // Logic random nằm gọn ở đây
        return cards;
    }

    private Map<Long, FlashcardsProgress> getProgressMap(Long userId, List<Long> cardIds) {
        if (cardIds.isEmpty()) return Collections.emptyMap();

        return flashcardsProgressRepository.findByUserIdAndFlashcardIdIn(userId, cardIds)
                .stream()
                .collect(Collectors.toMap(p -> p.getFlashcard().getId(), p -> p));
    }

    private Map<Long, List<Media>> getMediaMap(List<Long> cardIds) {
        if (cardIds.isEmpty()) return Collections.emptyMap();

        return mediaRepository.findBySourceTypeAndSourceIdIn("flashcards", cardIds)
                .stream()
                .collect(Collectors.groupingBy(Media::getSourceId));
    }

    private DecksResponse buildDecksResponse(Decks deck,
                                             List<Flashcards> cards,
                                             Map<Long, FlashcardsProgress> progressMap,
                                             Map<Long, List<Media>> mediaMap) {
        // Map Deck Info
        DecksResponse response = modelMapper.map(deck, DecksResponse.class);

        // Map List Flashcards
        List<FlashcardsResponse> fcResponses = cards.stream().map(fc -> {
            FlashcardsResponse dto = modelMapper.map(fc, FlashcardsResponse.class);

            // Map Media
            if (mediaMap.containsKey(fc.getId())) {
                List<MediaResponse> mediaDtos = mediaMap.get(fc.getId()).stream()
                        .map(m -> modelMapper.map(m, MediaResponse.class))
                        .toList();
                dto.setMediaList(mediaDtos);
            }

            // Map Progress (Logic xử lý thẻ NEW nằm ở đây)
            FlashcardsProgress progress = progressMap.get(fc.getId());
            dto.setFlashcardsProgress(mapProgressToDto(progress)); // Tách nhỏ hơn nữa nếu cần

            return dto;
        }).toList();

        response.setFlashcardsList(fcResponses);
        return response;
    }

    // Hàm phụ để xử lý logic Default Progress
    private FlashcardsProgressResponse mapProgressToDto(FlashcardsProgress progress) {
        if (progress != null) {
            return modelMapper.map(progress, FlashcardsProgressResponse.class);
        } else {
            FlashcardsProgressResponse newP = new FlashcardsProgressResponse();
            newP.setStatus("NEW");
            newP.setBoxNumber(0);
            return newP;
        }
    }
}
