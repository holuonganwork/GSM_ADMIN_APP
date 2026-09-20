package com.greensm.compliance.dto.response;

import com.greensm.compliance.domain.enums.DecisionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseDecisionDto {
    private DecisionType decisionType;
    private String decidedAt;
    private String officerName;
    private String officerCode;
    private Integer fineAmount;
    private Integer suspensionDays;
    private String reason;
    private String messageToDriver;
}
