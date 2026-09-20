package com.greensm.compliance.service;

import com.greensm.compliance.domain.Driver;
import com.greensm.compliance.dto.response.DriverDto;
import com.greensm.compliance.exception.ResourceNotFoundException;
import com.greensm.compliance.repository.DriverRepository;
import com.greensm.compliance.service.mapper.EntityMapper;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    @Transactional(readOnly = true)
    public List<DriverDto> getAllDrivers(String search) {
        List<Driver> drivers = driverRepository.searchDrivers(search != null ? search.trim() : null);
        return drivers.stream()
            .map(EntityMapper::toDriverDto)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DriverDto getDriverByCccd(String cccd) {
        Driver driver = driverRepository.findByCccd(cccd)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài xế có số CCCD: " + cccd, "DRIVER_NOT_FOUND"));
        return EntityMapper.toDriverDto(driver);
    }
}
