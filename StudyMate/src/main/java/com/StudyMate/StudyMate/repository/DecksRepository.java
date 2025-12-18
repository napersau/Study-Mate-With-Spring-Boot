package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.Decks;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DecksRepository extends JpaRepository<Decks, Long> {
    Decks findDeckByTitle(String title);

//    @Query("SELECT d FROM Decks d LEFT JOIN FETCH d.flashcardsList WHERE d.id = :id")
    Optional<Decks> findById(Long id);
}
