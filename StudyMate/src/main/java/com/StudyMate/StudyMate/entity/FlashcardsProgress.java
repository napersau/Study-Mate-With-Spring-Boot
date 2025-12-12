package com.StudyMate.StudyMate.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "flashcards_progress")
public class FlashcardsProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "last_reviewed_at")
    private Instant lastReviewedAt;

    @Column(name = "next_review_at")
    private Instant nextReviewAt;

    @Column(name = "status")
    private String status; // e.g., "NEW", "LEARNING", "REVIEW

    @Column(name = "box_number")
    private Integer boxNumber; // For spaced repetition systems

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "flashcard_id", nullable = false)
    private Flashcards flashcard;
}
