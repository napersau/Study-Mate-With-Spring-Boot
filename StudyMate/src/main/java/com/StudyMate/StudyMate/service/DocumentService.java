package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.DocumentRequest;
import com.StudyMate.StudyMate.dto.response.DocumentResponse;

import java.util.List;

public interface DocumentService {
    DocumentResponse createDocument(DocumentRequest documentRequest);
    DocumentResponse getDocumentById(Long id);
    DocumentResponse updateDocument(Long id, DocumentRequest documentRequest);
    List<DocumentResponse> getAllDocuments();
    List<DocumentResponse> getDocumentsByCategory(String category);
    void deleteDocument(Long id);
}
