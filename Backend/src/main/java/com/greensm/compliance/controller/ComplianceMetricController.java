package com.greensm.compliance.controller;

import com.greensm.compliance.dto.response.ComplianceMetricsDto;
import com.greensm.compliance.service.MetricService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/compliance/metrics")
@RequiredArgsConstructor
@Tag(name = "Compliance Metrics API", description = "Chỉ số thống kê KPI ca trực và báo cáo tuân thủ")
public class ComplianceMetricController {

    private final MetricService metricService;

    @GetMapping
    @Operation(summary = "Lấy các chỉ số KPI tuân thủ, tỷ lệ tha lỗi/xử phạt và số tiền thu hồi")
    public ResponseEntity<ComplianceMetricsDto> getMetrics() {
        ComplianceMetricsDto metrics = metricService.getMetrics();
        return ResponseEntity.ok(metrics);
    }
}
