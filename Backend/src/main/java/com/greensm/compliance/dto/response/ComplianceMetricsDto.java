package com.greensm.compliance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceMetricsDto {
    private Long totalCases;
    private Long pendingReview;
    private Long exoneratedCount;
    private Long penalizedCount;
    private Long warnedCount;
    private Long supplementaryCount;
    private Long totalFinesRecovered;
    private Double avgReviewTimeHours;
    private Double slaCompliancePercent;
}
