package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.Flashcards;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FlashcardsRepository extends JpaRepository<Flashcards, Long> {
    boolean existsByTerm(String term);
}
