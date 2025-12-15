package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.DecksRequest;
import com.StudyMate.StudyMate.dto.request.FlashcardsRequest;
import com.StudyMate.StudyMate.dto.response.DecksResponse;
import com.StudyMate.StudyMate.dto.response.FlashcardsResponse;

import java.util.List;

public interface DecksService {
    DecksResponse createDecks(List<FlashcardsRequest> flashcardsRequests, DecksRequest decksRequest);
    List<DecksResponse> getAllDecks();
    DecksResponse getDeckById(Long id);
}
