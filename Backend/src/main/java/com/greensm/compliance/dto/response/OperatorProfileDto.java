package com.greensm.compliance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperatorProfileDto {
    private String id;
    private String name;
    private String code;
    private String role;
    private String shift;
    private String shiftTime;
    private String avatarUrl;
    private String status;
}
