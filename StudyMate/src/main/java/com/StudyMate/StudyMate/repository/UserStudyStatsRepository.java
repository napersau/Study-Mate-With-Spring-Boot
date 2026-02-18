package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.UserStudyStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface UserStudyStatsRepository extends JpaRepository<UserStudyStats, Long> {
    Optional<UserStudyStats> findByUserIdAndStudyDate(Long userId, Instant studyDate);
}
