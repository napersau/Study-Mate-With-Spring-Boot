package com.StudyMate.StudyMate.service.impl;

import com.StudyMate.StudyMate.dto.request.CourseRequest;
import com.StudyMate.StudyMate.dto.request.LessonRequest;
import com.StudyMate.StudyMate.dto.request.SectionRequest;
import com.StudyMate.StudyMate.dto.response.CourseResponse;
import com.StudyMate.StudyMate.entity.Course;
import com.StudyMate.StudyMate.entity.Lesson;
import com.StudyMate.StudyMate.entity.Section;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.enums.LessonType;
import com.StudyMate.StudyMate.repository.CourseRepository;
import com.StudyMate.StudyMate.repository.EnrollmentRepository;
import com.StudyMate.StudyMate.service.CourseService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ModelMapper modelMapper;
    private final EnrollmentRepository enrollmentRepository;
    private final SecurityUtil securityUtil;

    @Override
    public CourseResponse createCourse(CourseRequest courseRequest) {

        Course course = Course.builder()
                .title(courseRequest.getTitle())
                .description(courseRequest.getDescription())
                .price(courseRequest.getPrice())
                .level(courseRequest.getLevel())
                .totalStudents(0)
                .isPublished(false)
                .build();

        courseRepository.save(course);

        return modelMapper.map(course, CourseResponse.class);
    }

    @Override
    public CourseResponse getCourseById(Long id) {

        User user = securityUtil.getCurrentUser();

        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        Boolean isEnrolled = enrollmentRepository.existsByUserIdAndCourseId(user.getId(), course.getId());

        CourseResponse courseResponse = modelMapper.map(course, CourseResponse.class);
        courseResponse.setIsEnrolled(isEnrolled);
        return courseResponse;
    }

    @Override
    public List<CourseResponse> getAllCourses() {

        List<Course> courses = courseRepository.findAll();

        return courses.stream()
                .map(course -> modelMapper.map(course, CourseResponse.class)).toList();
    }

    @Override
    public CourseResponse updateCourse(Long id, CourseRequest request) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // 1. Cập nhật thông tin cơ bản của Course
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setLevel(request.getLevel());

        // 2. Đồng bộ hóa Sections
        syncSections(course, request.getSections());

        // 3. Lưu lại (Hibernate sẽ tự động lo việc cascade thêm/sửa/xóa các bảng con)
        courseRepository.save(course);

        return modelMapper.map(course, CourseResponse.class);
    }

    @Override
    public CourseResponse publishCourse(Long id) {

        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        course.setIsPublished(true);
        courseRepository.save(course);

        return modelMapper.map(course, CourseResponse.class);
    }

    @Override
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    private void syncSections(Course course, List<SectionRequest> sectionRequests) {
        if (sectionRequests == null) return;

        // a. Tạo danh sách các ID được gửi lên (để check cái nào cần xóa)
        Set<Long> incomingSectionIds = sectionRequests.stream()
                .map(SectionRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // b. XÓA các section không còn tồn tại trong request
        // Nhờ có orphanRemoval = true, khi remove khỏi list, nó sẽ bị xóa khỏi Database
        course.getSections().removeIf(existingSec ->
                existingSec.getId() != null && !incomingSectionIds.contains(existingSec.getId()));

        // c. THÊM MỚI hoặc CẬP NHẬT
        for (SectionRequest req : sectionRequests) {
            if (req.getId() == null) {
                // THÊM MỚI (Không có ID)
                Section newSection = new Section();
                newSection.setTitle(req.getTitle());
                newSection.setOrderIndex(req.getOrderIndex());
                newSection.setCourse(course); // RẤT QUAN TRỌNG: Map 2 chiều

                // Xử lý các bài học bên trong Section mới này
                syncLessons(newSection, req.getLessons());

                course.getSections().add(newSection);
            } else {
                // CẬP NHẬT (Tìm section cũ trong danh sách hiện tại)
                Section existingSection = course.getSections().stream()
                        .filter(s -> s.getId().equals(req.getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Section ID không hợp lệ"));

                existingSection.setTitle(req.getTitle());
                existingSection.setOrderIndex(req.getOrderIndex());

                // Xử lý cập nhật bài học bên trong Section này
                syncLessons(existingSection, req.getLessons());
            }
        }
    }

    private void syncLessons(Section section, List<LessonRequest> lessonRequests) {
        if (lessonRequests == null) return;

        // Lọc ID của Lesson
        Set<Long> incomingLessonIds = lessonRequests.stream()
                .map(LessonRequest::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // XÓA Lesson
        section.getLessons().removeIf(existingLesson ->
                existingLesson.getId() != null && !incomingLessonIds.contains(existingLesson.getId()));

        // THÊM MỚI / CẬP NHẬT Lesson
        for (LessonRequest req : lessonRequests) {
            if (req.getId() == null) {
                // THÊM MỚI
                Lesson newLesson = new Lesson();
                updateLessonFields(newLesson, req);
                newLesson.setSection(section); // Map 2 chiều
                section.getLessons().add(newLesson);
            } else {
                // CẬP NHẬT
                Lesson existingLesson = section.getLessons().stream()
                        .filter(l -> l.getId().equals(req.getId()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Lesson ID không hợp lệ"));
                updateLessonFields(existingLesson, req);
            }
        }
    }

    private void updateLessonFields(Lesson lesson, LessonRequest req) {
        lesson.setTitle(req.getTitle());
        lesson.setOrderIndex(req.getOrderIndex());
        lesson.setIsFree(req.getIsFree());
        lesson.setType(LessonType.valueOf(req.getType()));
        lesson.setVideoUrl(req.getVideoUrl());
        lesson.setDuration(req.getDuration());


        // Map thêm document, exam, deck tùy vào LessonType...
    }


}
