package com.greensm.compliance.dto.response;

import com.greensm.compliance.domain.enums.CaseSeverity;
import com.greensm.compliance.domain.enums.CaseStatus;
import com.greensm.compliance.domain.enums.FraudType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FraudCaseResponseDto {
    private String id;
    private FraudType fraudType;
    private String fraudTypeLabel;
    private CaseSeverity severity;
    private String severityLabel;
    private String createdAt;
    private String timeAgo;
    private Integer deadlineHours;
    private DriverDto driver;
    private SystemEvidenceDto evidence;
    private DriverExplanationDto explanation;
    private CaseStatus status;
    private String statusLabel;
    private CaseDecisionDto decision;
}
