package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.dto.request.CourseRequest;
import com.StudyMate.StudyMate.dto.response.CourseResponse;
import com.StudyMate.StudyMate.entity.Course;
import com.StudyMate.StudyMate.repository.CourseRepository;
import com.StudyMate.StudyMate.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ModelMapper modelMapper;

    @Override
    public CourseResponse createCourse(CourseRequest courseRequest) {

        Course course = Course.builder()
                .title(courseRequest.getTitle())
                .description(courseRequest.getDescription())
                .price(courseRequest.getPrice())
                .level(courseRequest.getLevel())
                .build();

        courseRepository.save(course);

        return modelMapper.map(course, CourseResponse.class);
    }

    @Override
    public CourseResponse getCourseById(Long id) {

        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        return modelMapper.map(course, CourseResponse.class);
    }

    @Override
    public List<CourseResponse> getAllCourses() {

        List<Course> courses = courseRepository.findAll();

        return courses.stream()
                .map(course -> modelMapper.map(course, CourseResponse.class)).toList();
    }
}
