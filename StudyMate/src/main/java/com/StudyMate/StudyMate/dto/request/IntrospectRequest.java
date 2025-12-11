package com.StudyMate.StudyMate.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IntrospectRequest {
    private String token;
}
