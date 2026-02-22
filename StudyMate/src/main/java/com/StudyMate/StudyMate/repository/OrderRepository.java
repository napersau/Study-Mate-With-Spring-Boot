package com.StudyMate.StudyMate.repository;

import com.StudyMate.StudyMate.entity.Enrollment;
import com.StudyMate.StudyMate.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Order findByVnpTxnRef(String vnpTxnRef);
    List<Order> findByUserId(Long userId);
}
