package com.StudyMate.StudyMate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "user_gamification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGamification {
    @Id
    private Long userId;

    @Column(name = "current_streak")
    private Integer currentStreak = 0;

    @Column(name = "longest_streak")
    private Integer longestStreak = 0;

    @Column(name = "last_learn_date")
    private Instant lastLearnDate;
}
