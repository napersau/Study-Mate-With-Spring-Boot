package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.FlashcardsProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FlashcardsProgressRepository extends JpaRepository<FlashcardsProgress, Long> {
    List<FlashcardsProgress> findByUserId(Long userId);
    Optional<FlashcardsProgress> findByUserIdAndFlashcardId(Long userId, Long flashcardId);
}
