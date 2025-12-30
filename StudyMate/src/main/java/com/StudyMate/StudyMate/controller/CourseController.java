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
        CourseResponse courseResponse = courseService.createCourse(courseRequest);
        return ApiResponse.<CourseResponse>builder()
                .result(courseResponse)
                .message("Course created successfully")
                .build();
    }

    @GetMapping("/{id}")
    ApiResponse<CourseResponse> getCourseById(@PathVariable Long id) {
        CourseResponse courseResponse = courseService.getCourseById(id);
        return ApiResponse.<CourseResponse>builder()
                .result(courseResponse)
                .message("Course fetched successfully")
                .build();
    }

    @GetMapping("/all")
    ApiResponse<List<CourseResponse>> getAllCourses() {
        List<CourseResponse> courses = courseService.getAllCourses();
        return ApiResponse.<List<CourseResponse>>builder()
                .result(courses)
                .message("All courses fetched successfully")
                .build();
    }
}
