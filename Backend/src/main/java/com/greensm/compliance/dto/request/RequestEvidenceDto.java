package com.greensm.compliance.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RequestEvidenceDto {

    @NotBlank(message = "Nội dung yêu cầu bổ sung chứng cứ không được để trống")
    private String note;
}
