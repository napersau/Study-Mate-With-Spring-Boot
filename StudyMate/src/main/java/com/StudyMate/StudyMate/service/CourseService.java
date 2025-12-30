package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.response.CourseResponse;

public interface CourseService {
    CourseResponse createCourse(CourseResponse courseResponse);
    CourseResponse getCourseById(Long id);
}
