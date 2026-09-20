package com.greensm.compliance.controller;

import com.greensm.compliance.dto.request.OperatorStatusRequestDto;
import com.greensm.compliance.dto.response.OperatorProfileDto;
import com.greensm.compliance.service.OperatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/operator")
@RequiredArgsConstructor
@Tag(name = "Operator Profile API", description = "Quản lý hồ sơ và trạng thái trực ca của kiểm soát viên")
public class OperatorController {

    private final OperatorService operatorService;

    @GetMapping("/profile")
    @Operation(summary = "Lấy thông tin tài khoản chuyên viên kiểm soát đang trực ca")
    public ResponseEntity<OperatorProfileDto> getProfile() {
        OperatorProfileDto profile = operatorService.getProfile();
        return ResponseEntity.ok(profile);
    }

    @PatchMapping("/status")
    @Operation(summary = "Cập nhật trạng thái trực ca của chuyên viên (online, break, busy)")
    public ResponseEntity<OperatorProfileDto> updateStatus(
        @Valid @RequestBody OperatorStatusRequestDto request
    ) {
        OperatorProfileDto updated = operatorService.updateStatus(request.getStatus());
        return ResponseEntity.ok(updated);
    }
}
