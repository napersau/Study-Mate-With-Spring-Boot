package com.StudyMate.StudyMate.repository;


import com.StudyMate.StudyMate.entity.Document;
import com.StudyMate.StudyMate.enums.DocCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findDocumentsByCategory(DocCategory category);
}
