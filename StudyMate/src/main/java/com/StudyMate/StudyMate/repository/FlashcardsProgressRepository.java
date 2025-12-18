package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.FlashcardsProgress;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardsProgressRepository extends JpaRepository<FlashcardsProgress, Long> {

    Optional<FlashcardsProgress> findByUserIdAndFlashcardId(Long userId, Long flashcardId);

    @EntityGraph(attributePaths = {"flashcard"})
    List<FlashcardsProgress> findByUserId(Long userId);

    List<FlashcardsProgress> findByUserIdAndFlashcardIdIn(Long userId, List<Long> flashcardIds);

    @Query("""
           SELECT p FROM FlashcardsProgress p
           JOIN FETCH p.flashcard f
           WHERE p.user.id = :userId AND p.nextReviewAt <= :now
           ORDER BY p.nextReviewAt ASC
    """)
    List<FlashcardsProgress> findDueFlashcards(Long userId, Instant now);
}
