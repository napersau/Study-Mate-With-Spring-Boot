package com.StudyMate.StudyMate.service;

import com.StudyMate.StudyMate.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    void processSuccessfulPayment(String vnpTxnRef);
    List<OrderResponse> getAllOrders();
}
