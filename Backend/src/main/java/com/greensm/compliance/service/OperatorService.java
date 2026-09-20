package com.greensm.compliance.service;

import com.greensm.compliance.domain.Operator;
import com.greensm.compliance.domain.enums.OperatorStatus;
import com.greensm.compliance.dto.response.OperatorProfileDto;
import com.greensm.compliance.repository.OperatorRepository;
import com.greensm.compliance.service.mapper.EntityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OperatorService {

    private final OperatorRepository operatorRepository;

    @Transactional(readOnly = true)
    public OperatorProfileDto getProfile() {
        Operator op = operatorRepository.findById("op-001")
            .orElseGet(() -> Operator.builder()
                .id("op-001")
                .name("Nguyễn Mai Chi")
                .code("GSM-INSPECT-88")
                .role("Chuyên viên Ban Kiểm Soát Tuân Thủ")
                .shift("Ca sáng")
                .shiftTime("07:00 - 15:00")
                .avatarUrl("/avatar-chi.svg")
                .status(OperatorStatus.ONLINE)
                .build());
        return EntityMapper.toOperatorProfileDto(op);
    }

    @Transactional
    public OperatorProfileDto updateStatus(OperatorStatus status) {
        Operator op = operatorRepository.findById("op-001")
            .orElseGet(() -> Operator.builder()
                .id("op-001")
                .name("Nguyễn Mai Chi")
                .code("GSM-INSPECT-88")
                .role("Chuyên viên Ban Kiểm Soát Tuân Thủ")
                .shift("Ca sáng")
                .shiftTime("07:00 - 15:00")
                .avatarUrl("/avatar-chi.svg")
                .status(OperatorStatus.ONLINE)
                .build());

        op.setStatus(status);
        operatorRepository.save(op);
        return EntityMapper.toOperatorProfileDto(op);
    }
}
