package com.greensm.compliance.dto.request;

import com.greensm.compliance.domain.enums.OperatorStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperatorStatusRequestDto {

    @NotNull(message = "Trạng thái ca trực không được để trống")
    private OperatorStatus status;
}
