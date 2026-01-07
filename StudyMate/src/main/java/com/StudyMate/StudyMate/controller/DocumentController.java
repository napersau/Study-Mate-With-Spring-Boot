package com.StudyMate.StudyMate.controller;


import com.StudyMate.StudyMate.dto.request.DocumentRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.DocumentResponse;
import com.StudyMate.StudyMate.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    ApiResponse<DocumentResponse> createDocument(@RequestBody @Valid DocumentRequest documentRequest){
        DocumentResponse response = documentService.createDocument(documentRequest);
        return ApiResponse.<DocumentResponse>builder()
                .code(1000)
                .result(response)
                .message("Tạo tài liệu thành công")
                .build();
    }

    @GetMapping("/category" )
    ApiResponse<List<DocumentResponse>> getDocumentsByCategory(@RequestParam(required = false) String category) {
        List<DocumentResponse> response = documentService.getDocumentsByCategory(category);
        return ApiResponse.<List<DocumentResponse>>builder()
                .code(1000)
                .result(response)
                .message("Lấy tài liệu theo danh mục thành công")
                .build();
    }

    @GetMapping("/{id}" )
    ApiResponse<DocumentResponse> getDocumentById(@PathVariable Long id) {
        DocumentResponse response = documentService.getDocumentById(id);
        return ApiResponse.<DocumentResponse>builder()
                .code(1000)
                .result(response)
                .message("Lấy tài liệu thành công")
                .build();
    }

    @PutMapping("/{id}" )
    ApiResponse<DocumentResponse> updateDocument(@PathVariable Long id, @RequestBody @Valid DocumentRequest documentRequest) {
        DocumentResponse response = documentService.updateDocument(id, documentRequest);
        return ApiResponse.<DocumentResponse>builder()
                .code(1000)
                .result(response)
                .message("Cập nhật tài liệu thành công")
                .build();
    }

    @DeleteMapping("/{id}" )
    ApiResponse<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Xóa tài liệu thành công")
                .build();
    }

}
