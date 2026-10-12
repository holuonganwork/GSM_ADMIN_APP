package com.greensm.compliance.service;

import com.greensm.compliance.config.RabbitMqConfig;
import com.greensm.compliance.domain.Driver;
import com.greensm.compliance.domain.DriverExplanation;
import com.greensm.compliance.domain.FraudCase;
import com.greensm.compliance.domain.SystemNotification;
import com.greensm.compliance.domain.TelematicsLog;
import com.greensm.compliance.domain.enums.CaseSeverity;
import com.greensm.compliance.domain.enums.CaseStatus;
import com.greensm.compliance.domain.enums.FraudType;
import com.greensm.compliance.repository.DriverRepository;
import com.greensm.compliance.repository.FraudCaseRepository;
import com.greensm.compliance.repository.NotificationRepository;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComplianceRabbitMqConsumer {

    private final FraudCaseRepository fraudCaseRepository;
    private final DriverRepository driverRepository;
    private final NotificationRepository notificationRepository;

    @RabbitListener(queues = RabbitMqConfig.ADMIN_REVIEWS_QUEUE)
    @Transactional
    public void handleReviewRequested(Map<String, Object> payload) {
        try {
            log.info("[RABBITMQ_ADMIN_RECV] Received investigation.review.requested: {}", payload);
            String caseId = (String) payload.get("case_id");
            String driverId = (String) payload.get("driver_id");
            String recommendation = (String) payload.get("ai_recommendation");
            String driverStatement = (String) payload.get("driver_statement");
            Double confidence = payload.get("confidence") instanceof Number ? ((Number) payload.get("confidence")).doubleValue() : 0.0;

            if (caseId == null || caseId.isBlank()) {
                log.warn("Invalid review requested payload: case_id missing");
                return;
            }

            if (driverId == null || driverId.isBlank()) {
                log.warn("Invalid review requested payload: driver_id missing for case {}", caseId);
                return;
            }

            Driver driver = driverRepository.findById(driverId).orElseGet(() -> {
                return driverRepository.findByCccd(driverId).orElse(null);
            });

            if (driver == null) {
                log.warn("Driver with ID/CCCD '{}' not found in database for case {}", driverId, caseId);
                return;
            }

            String timeNow = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")) + " (Hôm nay)";

            FraudCase fraudCase = fraudCaseRepository.findById(caseId).orElseGet(() -> {
                FraudCase fc = FraudCase.builder()
                    .id(caseId)
                    .fraudType(FraudType.CUOC_AO)
                    .fraudTypeLabel("Nghi vấn gian lận cuốc xe / Viễn thông")
                    .severity(CaseSeverity.NGHIEM_TRONG)
                    .severityLabel("Nghiêm trọng")
                    .createdAt(timeNow)
                    .timeAgo("Vừa xong")
                    .deadlineHours(4)
                    .status(CaseStatus.DA_NOP_CHO_DUYET)
                    .statusLabel("Chờ thẩm định")
                    .driver(driver)
                    .tripId("TRIP-" + caseId)
                    .tripCode("#GSM-" + caseId.replace("CASE-", ""))
                    .anomalyTitle("Phát hiện bất thường Telematics & Biên bản giải trình từ tài xế")
                    .anomalyDescription(recommendation != null ? recommendation : "Cần chuyên viên kiểm soát xác minh.")
                    .telematicsLogs(new ArrayList<>())
                    .build();
                return fc;
            });

            // Update status to Pending Review Desk
            fraudCase.setStatus(CaseStatus.DA_NOP_CHO_DUYET);
            fraudCase.setStatusLabel("Chờ thẩm định");

            // Attach Driver Explanation if provided
            if (driverStatement != null && !driverStatement.isBlank()) {
                DriverExplanation exp = fraudCase.getExplanation();
                if (exp == null) {
                    exp = DriverExplanation.builder()
                        .id("EXP-" + UUID.randomUUID().toString().substring(0, 8))
                        .fraudCase(fraudCase)
                        .reasonCategory("Tài xế trần tình qua ứng dụng GSM Driver")
                        .content(driverStatement)
                        .submittedAt(timeNow)
                        .status("da_nop_cho_duyet")
                        .build();
                    fraudCase.setExplanation(exp);
                } else {
                    exp.setContent(driverStatement);
                    exp.setSubmittedAt(timeNow);
                }
            }

            // Attach Telematics Log from AI
            TelematicsLog aiLog = TelematicsLog.builder()
                .id("TEL-AI-" + UUID.randomUUID().toString().substring(0, 8))
                .fraudCase(fraudCase)
                .time(timeNow)
                .event("ĐÁNH GIÁ AI CORE (Độ tin cậy: " + String.format("%.0f%%", confidence * 100) + ")")
                .detail(recommendation != null ? recommendation : "Chuyển tiếp chuyên viên thẩm định")
                .severity("high")
                .build();
            fraudCase.getTelematicsLogs().add(aiLog);

            fraudCaseRepository.save(fraudCase);

            // Create notification for Admin Specialist
            SystemNotification notif = SystemNotification.builder()
                .id("notif-" + UUID.randomUUID().toString().substring(0, 8))
                .title("Hồ sơ mới chuyển tiếp từ AI Core")
                .desc(String.format("Hồ sơ #%s của tài xế %s đã nộp giải trình và sẵn sàng thẩm định.", caseId, driver.getName()))
                .time("Vừa xong")
                .type("info")
                .isRead(false)
                .caseId(caseId)
                .build();
            notificationRepository.save(notif);

            log.info("[RABBITMQ_ADMIN_SAVED] Case {} is now active in Pending Review Desk (da_nop_cho_duyet).", caseId);
        } catch (Exception e) {
            log.error("Failed to process review requested event: {}", e.getMessage(), e);
        }
    }
}
