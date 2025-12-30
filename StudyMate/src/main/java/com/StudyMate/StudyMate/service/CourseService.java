package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.request.CourseRequest;
import com.StudyMate.StudyMate.dto.response.CourseResponse;

import java.util.List;

public interface CourseService {
    CourseResponse createCourse(CourseRequest courseRequest);
    CourseResponse getCourseById(Long id);
    List<CourseResponse> getAllCourses();
}
