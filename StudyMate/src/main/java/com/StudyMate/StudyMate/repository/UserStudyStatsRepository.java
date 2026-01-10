package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.UserStudyStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserStudyStatsRepository extends JpaRepository<UserStudyStats, Long> {
}
