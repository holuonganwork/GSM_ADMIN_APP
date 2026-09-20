package com.greensm.compliance.service;

import com.greensm.compliance.domain.CaseDecision;
import com.greensm.compliance.domain.Driver;
import com.greensm.compliance.domain.FraudCase;
import com.greensm.compliance.domain.enums.CaseSeverity;
import com.greensm.compliance.domain.enums.CaseStatus;
import com.greensm.compliance.domain.enums.DecisionType;
import com.greensm.compliance.domain.enums.FraudType;
import com.greensm.compliance.dto.request.DecisionRequestDto;
import com.greensm.compliance.dto.response.FraudCaseResponseDto;
import com.greensm.compliance.exception.InvalidPayloadException;
import com.greensm.compliance.exception.ResourceNotFoundException;
import com.greensm.compliance.repository.CaseDecisionRepository;
import com.greensm.compliance.repository.DriverRepository;
import com.greensm.compliance.repository.FraudCaseRepository;
import com.greensm.compliance.service.mapper.EntityMapper;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FraudCaseService {

    private final FraudCaseRepository fraudCaseRepository;
    private final DriverRepository driverRepository;
    private final CaseDecisionRepository caseDecisionRepository;

    @Transactional(readOnly = true)
    public List<FraudCaseResponseDto> getCases(String statusStr, String fraudTypeStr, String severityStr, String search) {
        CaseStatus status = null;
        if (statusStr != null && !statusStr.isBlank() && !"all".equalsIgnoreCase(statusStr)) {
            status = CaseStatus.fromCode(statusStr);
        }

        FraudType fraudType = null;
        if (fraudTypeStr != null && !fraudTypeStr.isBlank() && !"all".equalsIgnoreCase(fraudTypeStr)) {
            fraudType = FraudType.fromCode(fraudTypeStr);
        }

        CaseSeverity severity = null;
        if (severityStr != null && !severityStr.isBlank() && !"all".equalsIgnoreCase(severityStr)) {
            severity = CaseSeverity.fromCode(severityStr);
        }

        List<FraudCase> cases = fraudCaseRepository.findFiltered(status, fraudType, severity, search != null ? search.trim() : null);
        return cases.stream()
            .map(EntityMapper::toFraudCaseResponseDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FraudCaseResponseDto getCaseById(String id) {
        FraudCase c = fraudCaseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ mang mã #" + id, "CASE_NOT_FOUND"));
        return EntityMapper.toFraudCaseResponseDto(c);
    }

    @Transactional
    public FraudCaseResponseDto submitDecision(String id, DecisionRequestDto request) {
        FraudCase c = fraudCaseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ mang mã #" + id, "CASE_NOT_FOUND"));

        DecisionType decisionType = request.getDecisionType();
        if (decisionType == null) {
            throw new InvalidPayloadException("Loại phán quyết không được để trống", "INVALID_DECISION_TYPE");
        }

        if (decisionType == DecisionType.XU_PHAT_TIEN && (request.getFineAmount() == null || request.getFineAmount() <= 0)) {
            throw new InvalidPayloadException("Cần nhập số tiền phạt hợp lệ khi chọn xử phạt tiền", "INVALID_FINE_AMOUNT");
        }

        String officerName = (request.getOfficerName() != null && !request.getOfficerName().isBlank())
            ? request.getOfficerName() : "Nguyễn Mai Chi";
        String officerCode = (request.getOfficerCode() != null && !request.getOfficerCode().isBlank())
            ? request.getOfficerCode() : "GSM-INSPECT-88";

        String currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")) + " (Hôm nay)";

        CaseDecision decision = c.getDecision();
        if (decision == null) {
            decision = new CaseDecision();
            decision.setFraudCase(c);
        }

        decision.setDecisionType(decisionType);
        decision.setFineAmount(request.getFineAmount() != null ? request.getFineAmount() : 0);
        decision.setSuspensionDays(request.getSuspensionDays() != null ? request.getSuspensionDays() : 0);
        decision.setReason(request.getReason());
        decision.setMessageToDriver(request.getMessageToDriver());
        decision.setOfficerName(officerName);
        decision.setOfficerCode(officerCode);
        decision.setDecidedAt(currentTime);

        // Chuyển trạng thái hồ sơ theo Decision Mapping
        Driver driver = c.getDriver();
        switch (decisionType) {
            case THA_LOI:
                c.setStatus(CaseStatus.DA_THA_LOI);
                c.setStatusLabel("Đã tha lỗi / Minh oan");
                break;
            case CANH_CAO:
                c.setStatus(CaseStatus.DA_CANH_CAO);
                c.setStatusLabel("Đã nhắc nhở & cảnh cáo");
                if (driver != null) {
                    driver.setPriorViolationsCount(driver.getPriorViolationsCount() + 1);
                    driverRepository.save(driver);
                }
                break;
            case YEU_CAU_BO_SUNG:
                c.setStatus(CaseStatus.YEU_CAU_BO_SUNG);
                c.setStatusLabel("Yêu cầu bổ sung chứng cứ");
                break;
            case XU_PHAT_TIEN:
            case TAM_KHOA:
            case KHOA_VINH_VIEN:
                c.setStatus(CaseStatus.DA_XU_PHAT);
                c.setStatusLabel("Đã xử phạt vi phạm");
                if (driver != null) {
                    int penaltyScore = (decisionType == DecisionType.KHOA_VINH_VIEN) ? 100 : 20;
                    driver.setTrustScore(Math.max(0, driver.getTrustScore() - penaltyScore));
                    driver.setPriorViolationsCount(driver.getPriorViolationsCount() + 1);
                    driverRepository.save(driver);
                }
                break;
        }

        c.setDecision(decision);
        fraudCaseRepository.save(c);

        return EntityMapper.toFraudCaseResponseDto(c);
    }

    @Transactional
    public FraudCaseResponseDto requestMoreEvidence(String id, String note) {
        FraudCase c = fraudCaseRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ mang mã #" + id, "CASE_NOT_FOUND"));

        c.setStatus(CaseStatus.YEU_CAU_BO_SUNG);
        c.setStatusLabel("Yêu cầu bổ sung chứng cứ");

        String currentTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")) + " (Hôm nay)";

        CaseDecision decision = c.getDecision();
        if (decision == null) {
            decision = new CaseDecision();
            decision.setFraudCase(c);
        }
        decision.setDecisionType(DecisionType.YEU_CAU_BO_SUNG);
        decision.setReason("Yêu cầu cung cấp bổ sung tài liệu minh chứng kỹ thuật trong 24h.");
        decision.setMessageToDriver(note != null ? note : "Vui lòng gửi bổ sung ảnh hoặc biên nhận để thẩm định.");
        decision.setOfficerName("Nguyễn Mai Chi");
        decision.setOfficerCode("GSM-INSPECT-88");
        decision.setDecidedAt(currentTime);
        decision.setFineAmount(0);
        decision.setSuspensionDays(0);

        c.setDecision(decision);
        fraudCaseRepository.save(c);

        return EntityMapper.toFraudCaseResponseDto(c);
    }
}
