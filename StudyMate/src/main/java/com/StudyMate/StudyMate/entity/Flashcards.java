package com.StudyMate.StudyMate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "flashcards")
public class Flashcards {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "term", unique = true)
    private String term;

    @Column(name = "definition", columnDefinition = "TEXT") // Thay đổi này
    private String definition;

    @Column(name = "pronunciation")
    private String pronunciation;

    @Column(name = "example", columnDefinition = "TEXT") // Có thể cần thiết cho example
    private String example;

    @ManyToOne
    @JoinColumn(name = "deck_id")
    private Decks deck;
}