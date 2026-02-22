package com.StudyMate.StudyMate.service.impl;


import com.StudyMate.StudyMate.dto.response.OrderResponse;
import com.StudyMate.StudyMate.entity.Course;
import com.StudyMate.StudyMate.entity.Enrollment;
import com.StudyMate.StudyMate.entity.Order;
import com.StudyMate.StudyMate.entity.User;
import com.StudyMate.StudyMate.repository.CourseRepository;
import com.StudyMate.StudyMate.repository.EnrollmentRepository;
import com.StudyMate.StudyMate.repository.OrderRepository;
import com.StudyMate.StudyMate.service.OrderService;
import com.StudyMate.StudyMate.utils.SecurityUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final SecurityUtil securityUtil;
    private final ModelMapper modelMapper;

    @Transactional // Rất quan trọng: Phải đảm bảo cả 3 hành động đều thành công hoặc cùng rollback
    public void processSuccessfulPayment(String vnpTxnRef) {

        // 1. Tìm đơn hàng theo mã giao dịch
        Order order = orderRepository.findByVnpTxnRef(vnpTxnRef);

        // Chặn gian lận/lỗi logic: Nếu đơn hàng ĐÃ thanh toán rồi thì không xử lý lại
        if ("PAID".equals(order.getStatus())) {
            return;
        }

        // Bước 1: Cập nhật trạng thái đơn hàng thành ĐÃ THANH TOÁN
        order.setStatus("PAID");
        order.setPayDate(Instant.now());
        orderRepository.save(order);

        // Bước 2: Cấp quyền truy cập khóa học cho User (Thêm vào bảng UserCourse)
        Enrollment enrollment = Enrollment.builder()
                .user(order.getUser())
                .course(order.getCourse())
                .enrollDate(Instant.now())
                .progress(0D)
                .isCompleted(false)
                .build();
        enrollmentRepository.save(enrollment);

        // Bước 3: (Tùy chọn nhưng nên làm) Tăng số lượng học viên của khóa học lên 1
        Course course = order.getCourse();
        course.setTotalStudents(course.getTotalStudents() + 1);
        courseRepository.save(course);
    }

    @Override
    public List<OrderResponse> getAllOrders() {

        User user = securityUtil.getCurrentUser();
        List<Order> orders = orderRepository.findByUserId(user.getId());

        return orders.stream()
                .map(order -> modelMapper.map(order, OrderResponse.class))
                .toList();
    }
}
