package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.UserGamification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserGamificationRepository extends JpaRepository<UserGamification, Long> {
}
