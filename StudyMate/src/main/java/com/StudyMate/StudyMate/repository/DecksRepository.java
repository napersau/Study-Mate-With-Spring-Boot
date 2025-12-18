package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.Decks;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DecksRepository extends JpaRepository<Decks, Long> {
    Decks findDeckByTitle(String title);
    @EntityGraph(attributePaths = {
            "flashcardsList",
            "flashcardsList.mediaList"
    })
    Optional<Decks> findById(Long id);
}
