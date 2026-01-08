package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.Flashcards;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlashcardsRepository extends JpaRepository<Flashcards, Long> {
    boolean existsByTerm(String term);
    @Query("SELECT f FROM Flashcards f " +
            "LEFT JOIN FlashcardsProgress p ON f.id = p.flashcard.id AND p.user.id = :userId " +
            "WHERE f.deck.id = :deckId " +
            // Điều kiện: (Chưa học bao giờ) HOẶC (Đã đến giờ ôn lại)
            "AND (p.id IS NULL OR p.nextReviewAt <= CURRENT_TIMESTAMP)")
    List<Flashcards> findCardsToLearn(@Param("deckId") Long deckId, @Param("userId") Long userId);
}
