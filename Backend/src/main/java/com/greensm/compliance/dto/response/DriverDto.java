package com.greensm.compliance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DriverDto {
    private String id;
    private String name;
    private String cccd; // CCCD 12 số - Không có trường đội xe
    private String phone;
    private String plate;
    private String vehicleModel;
    private String avatarUrl;
    private Integer trustScore;
    private Integer priorViolationsCount;
    private Integer completedRides;
    private Double rating;
}
