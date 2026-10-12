package com.greensm.compliance.service;

import com.greensm.compliance.domain.enums.CaseStatus;
import com.greensm.compliance.dto.response.ComplianceMetricsDto;
import com.greensm.compliance.repository.CaseDecisionRepository;
import com.greensm.compliance.repository.FraudCaseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MetricService {

    private final FraudCaseRepository fraudCaseRepository;
    private final CaseDecisionRepository caseDecisionRepository;

    @Transactional(readOnly = true)
    public ComplianceMetricsDto getMetrics() {
        long total = fraudCaseRepository.count();
        long pending = fraudCaseRepository.countByStatus(CaseStatus.DA_NOP_CHO_DUYET);
        long exonerated = fraudCaseRepository.countByStatus(CaseStatus.DA_THA_LOI);
        long penalized = fraudCaseRepository.countByStatus(CaseStatus.DA_XU_PHAT);
        long warned = fraudCaseRepository.countByStatus(CaseStatus.DA_CANH_CAO);
        long supplementary = fraudCaseRepository.countByStatus(CaseStatus.YEU_CAU_BO_SUNG);

        Long fines = caseDecisionRepository.sumTotalFines();
        long totalFines = (fines != null) ? fines : 0L;

        double slaPercent = 0.0;
        if (total > 0) {
            long compliantCount = fraudCaseRepository.findAll().stream()
                .filter(c -> c.getDeadlineHours() == null || c.getDeadlineHours() >= 0)
                .count();
            slaPercent = Math.round(((double) compliantCount / total) * 1000.0) / 10.0;
        }

        return ComplianceMetricsDto.builder()
            .totalCases(total)
            .pendingReview(pending)
            .exoneratedCount(exonerated)
            .penalizedCount(penalized)
            .warnedCount(warned)
            .supplementaryCount(supplementary)
            .totalFinesRecovered(totalFines)
            .avgReviewTimeHours(0.0)
            .slaCompliancePercent(slaPercent)
            .build();
    }
}
