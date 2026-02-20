package com.StudyMate.StudyMate.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudyTimeRequest {

    @NotNull(message = "Số giây không được để trống")
    @Min(value = 1, message = "Thời gian học ít nhất phải là 1 giây")
    private Long seconds;
}
