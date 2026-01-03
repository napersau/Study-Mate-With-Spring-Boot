package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.QuestionGroup;
import com.StudyMate.StudyMate.enums.PartType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionGroupRepository extends JpaRepository<QuestionGroup, Long> {
    List<QuestionGroup> findByIdIn(List<Long> ids);
    List<QuestionGroup> findByTypeAndExamIsNull(PartType type);
}