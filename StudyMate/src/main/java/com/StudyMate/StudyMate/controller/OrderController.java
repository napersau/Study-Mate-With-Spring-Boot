package com.StudyMate.StudyMate.controller;

import com.StudyMate.StudyMate.dto.response.ApiResponse;
import com.StudyMate.StudyMate.dto.response.OrderResponse;
import com.StudyMate.StudyMate.service.OrderService;
import com.cloudinary.Api;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/process-payment")
    ApiResponse<Void> processSuccessfulPayment(@RequestParam String vnpTxnRef){
        orderService.processSuccessfulPayment(vnpTxnRef);
        return ApiResponse.<Void>builder()
                .message("Payment successful")
                .code(1000)
                .build();
    }

    @GetMapping("/list")
    ApiResponse<List<OrderResponse>> getAllOrders(){

        List<OrderResponse> responses = orderService.getAllOrders();

        return ApiResponse.<List<OrderResponse>>builder()
                .result(responses)
                .code(1000)
                .message("Load all orders successfully")
                .build();
    }


}
