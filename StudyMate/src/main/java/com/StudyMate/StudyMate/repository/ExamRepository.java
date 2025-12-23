package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.Exam;
import com.StudyMate.StudyMate.enums.ExamType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    boolean existsByTitle(String title);
    List<Exam> findExamsByType(ExamType type);
}
