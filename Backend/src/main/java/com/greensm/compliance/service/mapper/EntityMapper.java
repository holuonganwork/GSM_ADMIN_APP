package com.greensm.compliance.service.mapper;

import com.greensm.compliance.domain.CaseDecision;
import com.greensm.compliance.domain.Driver;
import com.greensm.compliance.domain.DriverExplanation;
import com.greensm.compliance.domain.ExplanationAttachment;
import com.greensm.compliance.domain.FraudCase;
import com.greensm.compliance.domain.Operator;
import com.greensm.compliance.domain.SystemNotification;
import com.greensm.compliance.domain.TelematicsLog;
import com.greensm.compliance.dto.response.CaseDecisionDto;
import com.greensm.compliance.dto.response.DriverDto;
import com.greensm.compliance.dto.response.DriverExplanationDto;
import com.greensm.compliance.dto.response.ExplanationAttachmentDto;
import com.greensm.compliance.dto.response.FraudCaseResponseDto;
import com.greensm.compliance.dto.response.NotificationDto;
import com.greensm.compliance.dto.response.OperatorProfileDto;
import com.greensm.compliance.dto.response.SystemEvidenceDto;
import com.greensm.compliance.dto.response.TelematicsLogDto;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class EntityMapper {

    public static DriverDto toDriverDto(Driver driver) {
        if (driver == null) return null;
        return DriverDto.builder()
            .id(driver.getId())
            .name(driver.getName())
            .cccd(driver.getCccd())
            .phone(driver.getPhone())
            .plate(driver.getPlate())
            .vehicleModel(driver.getVehicleModel())
            .avatarUrl(driver.getAvatarUrl())
            .trustScore(driver.getTrustScore())
            .priorViolationsCount(driver.getPriorViolationsCount())
            .completedRides(driver.getCompletedRides())
            .rating(driver.getRating())
            .build();
    }

    public static TelematicsLogDto toTelematicsLogDto(TelematicsLog log) {
        if (log == null) return null;
        return TelematicsLogDto.builder()
            .id(log.getId())
            .time(log.getTime())
            .event(log.getEvent())
            .detail(log.getDetail())
            .severity(log.getSeverity())
            .build();
    }

    public static ExplanationAttachmentDto toAttachmentDto(ExplanationAttachment attachment) {
        if (attachment == null) return null;
        return ExplanationAttachmentDto.builder()
            .id(attachment.getId())
            .name(attachment.getName())
            .url(attachment.getUrl())
            .type(attachment.getType())
            .sizeText(attachment.getSizeText())
            .build();
    }

    public static DriverExplanationDto toDriverExplanationDto(DriverExplanation exp) {
        if (exp == null) return null;
        List<ExplanationAttachmentDto> attachments = exp.getAttachments() != null
            ? exp.getAttachments().stream().map(EntityMapper::toAttachmentDto).collect(Collectors.toList())
            : Collections.emptyList();

        return DriverExplanationDto.builder()
            .explanationId(exp.getId())
            .submittedAt(exp.getSubmittedAt())
            .reasonCategory(exp.getReasonCategory())
            .content(exp.getContent())
            .attachments(attachments)
            .status(exp.getStatus())
            .build();
    }

    public static SystemEvidenceDto toSystemEvidenceDto(FraudCase c) {
        if (c == null) return null;
        List<TelematicsLogDto> logs = c.getTelematicsLogs() != null
            ? c.getTelematicsLogs().stream().map(EntityMapper::toTelematicsLogDto).collect(Collectors.toList())
            : Collections.emptyList();

        return SystemEvidenceDto.builder()
            .tripId(c.getTripId())
            .tripCode(c.getTripCode())
            .detectedAt(c.getDetectedAt())
            .anomalyTitle(c.getAnomalyTitle())
            .anomalyDescription(c.getAnomalyDescription())
            .fareAmount(c.getFareAmount())
            .voucherAmount(c.getVoucherAmount())
            .bonusClaimed(c.getBonusClaimed())
            .pickup(c.getPickup())
            .dropoff(c.getDropoff())
            .gpsDistanceKm(c.getGpsDistanceKm())
            .telematicsActualKm(c.getTelematicsActualKm())
            .maxSpeedKmh(c.getMaxSpeedKmh())
            .deviceImeiSameAsCustomer(c.getDeviceImeiSameAsCustomer())
            .telematicsLogs(logs)
            .build();
    }

    public static CaseDecisionDto toCaseDecisionDto(CaseDecision d) {
        if (d == null) return null;
        return CaseDecisionDto.builder()
            .decisionType(d.getDecisionType())
            .decidedAt(d.getDecidedAt())
            .officerName(d.getOfficerName())
            .officerCode(d.getOfficerCode())
            .fineAmount(d.getFineAmount())
            .suspensionDays(d.getSuspensionDays())
            .reason(d.getReason())
            .messageToDriver(d.getMessageToDriver())
            .build();
    }

    public static FraudCaseResponseDto toFraudCaseResponseDto(FraudCase c) {
        if (c == null) return null;
        return FraudCaseResponseDto.builder()
            .id(c.getId())
            .fraudType(c.getFraudType())
            .fraudTypeLabel(c.getFraudTypeLabel())
            .severity(c.getSeverity())
            .severityLabel(c.getSeverityLabel())
            .createdAt(c.getCreatedAt())
            .timeAgo(c.getTimeAgo())
            .deadlineHours(c.getDeadlineHours())
            .driver(toDriverDto(c.getDriver()))
            .evidence(toSystemEvidenceDto(c))
            .explanation(toDriverExplanationDto(c.getExplanation()))
            .status(c.getStatus())
            .statusLabel(c.getStatusLabel())
            .decision(toCaseDecisionDto(c.getDecision()))
            .build();
    }

    public static OperatorProfileDto toOperatorProfileDto(Operator op) {
        if (op == null) return null;
        return OperatorProfileDto.builder()
            .id(op.getId())
            .name(op.getName())
            .code(op.getCode())
            .role(op.getRole())
            .shift(op.getShift())
            .shiftTime(op.getShiftTime())
            .avatarUrl(op.getAvatarUrl())
            .status(op.getStatus() != null ? op.getStatus().getCode() : "online")
            .build();
    }

    public static NotificationDto toNotificationDto(SystemNotification notif) {
        if (notif == null) return null;
        return NotificationDto.builder()
            .id(notif.getId())
            .title(notif.getTitle())
            .desc(notif.getDesc())
            .time(notif.getTime())
            .type(notif.getType())
            .read(notif.getIsRead())
            .caseId(notif.getCaseId())
            .build();
    }
}
