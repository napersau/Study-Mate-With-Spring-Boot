package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.request.DocumentRequest;
import com.StudyMate.StudyMate.dto.response.DocumentResponse;
import com.StudyMate.StudyMate.entity.Document;
import com.StudyMate.StudyMate.enums.DocCategory;
import com.StudyMate.StudyMate.repository.DocumentRepository;
import com.StudyMate.StudyMate.service.DocumentService;
import com.StudyMate.StudyMate.utils.MediaUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ModelMapper modelMapper;
    private final MediaUtil mediaUtil;

    @Override
    public DocumentResponse createDocument(DocumentRequest documentRequest) {

        Document document = Document.builder()
                .title(documentRequest.getTitle())
                .description(documentRequest.getDescription())
                .thumbnail(documentRequest.getThumbnail())
                .content(documentRequest.getContent())
                .category(documentRequest.getCategory())
                .isPublished(documentRequest.isPublished())
                .build();
        documentRepository.save(document);

        return modelMapper.map(document, DocumentResponse.class);
    }

    @Override
    public DocumentResponse getDocumentById(Long id) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        document.setViewCount(document.getViewCount() + 1);
        documentRepository.save(document);

        return modelMapper.map(document, DocumentResponse.class);
    }

    @Override
    public DocumentResponse updateDocument(Long id, DocumentRequest documentRequest) {

        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        document.setTitle(documentRequest.getTitle());
        document.setDescription(documentRequest.getDescription());
        document.setThumbnail(documentRequest.getThumbnail());
        document.setContent(documentRequest.getContent());
        document.setCategory(documentRequest.getCategory());
        document.setIsPublished(documentRequest.isPublished());

        documentRepository.save(document);

        return modelMapper.map(document, DocumentResponse.class);
    }

    @Override
    public List<DocumentResponse> getAllDocuments() {
        return List.of();
    }

    @Override
    public List<DocumentResponse> getDocumentsByCategory(String category) {

        List<Document> documents = documentRepository.findDocumentsByCategory(DocCategory.valueOf(category));

        return documents.stream().map(document
                -> modelMapper.map(document, DocumentResponse.class)).toList();
    }

    @Override
    public void deleteDocument(Long id) {
        documentRepository.deleteById(id);
    }
}
