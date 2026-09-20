package com.greensm.compliance.dto.request;

import com.greensm.compliance.domain.enums.DecisionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DecisionRequestDto {

    @NotNull(message = "Loại phán quyết không được để trống")
    private DecisionType decisionType;

    private Integer fineAmount;

    private Integer suspensionDays;

    @NotBlank(message = "Lý do và căn cứ xử lý không được để trống")
    private String reason;

    @NotBlank(message = "Thông điệp gửi tài xế không được để trống")
    private String messageToDriver;

    private String officerName;

    private String officerCode;
}
