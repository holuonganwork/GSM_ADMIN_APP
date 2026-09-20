package com.greensm.compliance.controller;

import com.greensm.compliance.dto.request.DecisionRequestDto;
import com.greensm.compliance.dto.request.RequestEvidenceDto;
import com.greensm.compliance.dto.response.FraudCaseResponseDto;
import com.greensm.compliance.service.FraudCaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/compliance/cases")
@RequiredArgsConstructor
@Tag(name = "Compliance Cases API", description = "Quản lý và thẩm định hồ sơ nghi vấn gian lận GSM")
public class ComplianceCaseController {

    private final FraudCaseService fraudCaseService;

    @GetMapping
    @Operation(summary = "Lấy danh sách hồ sơ gian lận theo bộ lọc và tìm kiếm thời gian thực")
    public ResponseEntity<List<FraudCaseResponseDto>> getCases(
        @RequestParam(name = "status", required = false) String status,
        @RequestParam(name = "fraudType", required = false) String fraudType,
        @RequestParam(name = "severity", required = false) String severity,
        @RequestParam(name = "search", required = false) String search
    ) {
        List<FraudCaseResponseDto> result = fraudCaseService.getCases(status, fraudType, severity, search);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết hồ sơ vi phạm và toàn bộ dữ liệu viễn thông Telematics")
    public ResponseEntity<FraudCaseResponseDto> getCaseById(@PathVariable("id") String id) {
        FraudCaseResponseDto result = fraudCaseService.getCaseById(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/decision")
    @Operation(summary = "Ban hành phán quyết thẩm định vi phạm chính thức từ chuyên viên")
    public ResponseEntity<FraudCaseResponseDto> submitDecision(
        @PathVariable("id") String id,
        @Valid @RequestBody DecisionRequestDto request
    ) {
        FraudCaseResponseDto result = fraudCaseService.submitDecision(id, request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/{id}/request-evidence")
    @Operation(summary = "Yêu cầu tài xế bổ sung biên bản hoặc chứng cứ minh oan trong 24h")
    public ResponseEntity<FraudCaseResponseDto> requestMoreEvidence(
        @PathVariable("id") String id,
        @Valid @RequestBody RequestEvidenceDto request
    ) {
        FraudCaseResponseDto result = fraudCaseService.requestMoreEvidence(id, request.getNote());
        return ResponseEntity.ok(result);
    }
}
