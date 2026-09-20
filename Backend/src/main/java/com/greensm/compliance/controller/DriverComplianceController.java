package com.greensm.compliance.controller;

import com.greensm.compliance.dto.response.DriverDto;
import com.greensm.compliance.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/compliance/drivers")
@RequiredArgsConstructor
@Tag(name = "Driver Compliance Directory", description = "Danh bạ tuân thủ & tra cứu hồ sơ tài xế theo CCCD 12 số")
public class DriverComplianceController {

    private final DriverService driverService;

    @GetMapping
    @Operation(summary = "Tìm kiếm danh bạ tài xế theo CCCD, tên, số điện thoại hoặc biển số xe")
    public ResponseEntity<List<DriverDto>> getAllDrivers(
        @RequestParam(name = "search", required = false) String search
    ) {
        List<DriverDto> drivers = driverService.getAllDrivers(search);
        return ResponseEntity.ok(drivers);
    }

    @GetMapping("/{cccd}")
    @Operation(summary = "Tra cứu chi tiết hồ sơ tín nhiệm và lịch sử vi phạm theo số CCCD 12 chữ số")
    public ResponseEntity<DriverDto> getDriverByCccd(@PathVariable("cccd") String cccd) {
        DriverDto driver = driverService.getDriverByCccd(cccd);
        return ResponseEntity.ok(driver);
    }
}
