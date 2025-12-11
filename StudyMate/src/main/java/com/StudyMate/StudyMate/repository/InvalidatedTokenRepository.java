package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.InvalidatedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedToken, String> {
}