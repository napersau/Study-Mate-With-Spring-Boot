package com.StudyMate.StudyMate.controller;


import com.StudyMate.StudyMate.dto.request.CourseRequest;
import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.CourseResponse;
import com.StudyMate.StudyMate.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping
    ApiResponse<CourseResponse> createCourse(@RequestBody CourseRequest courseRequest){
        CourseResponse response = courseService.createCourse(courseRequest);
        return ApiResponse.<CourseResponse>builder()
                .result(response)
                .code(1000)
                .message("Course created successfully")
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CourseResponse> getCourseById(@PathVariable Long id) {
        CourseResponse response = courseService.getCourseById(id);
        return ApiResponse.<CourseResponse>builder()
                .result(response)
                .code(1000)
                .message("Course fetched successfully")
                .build();
    }

    @GetMapping("/all")
    ApiResponse<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> response = courseService.getAllCourses();
        return ApiResponse.<List<CourseResponse>>builder()
                .result(response)
                .code(1000)
                .message("All courses fetched successfully")
                .build();
    }

    @PutMapping("/{id}")
    ApiResponse<CourseResponse> publishCourse(@PathVariable Long id){
        CourseResponse response = courseService.publishCourse(id);
        return ApiResponse.<CourseResponse>builder()
                .result(response)
                .code(1000)
                .message("Course published successfully")
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ApiResponse.<Void>builder()
                .code(1000)
                .message("Course deleted successfully")
                .build();
    }
}
