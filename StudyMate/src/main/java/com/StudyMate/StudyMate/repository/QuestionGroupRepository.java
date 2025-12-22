package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.QuestionGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionGroupRepository extends JpaRepository<QuestionGroup, Long> {
}
