package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    boolean existsByTitle(String title);
}
