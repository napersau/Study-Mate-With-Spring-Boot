package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.Decks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DecksRepository extends JpaRepository<Decks, Long> {
    Decks findDeckByTitle(String title);
}
