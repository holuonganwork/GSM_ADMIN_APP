package com.greensm.compliance.service;

import com.greensm.compliance.config.RabbitMqConfig;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComplianceRabbitMqPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishDecisionFinalized(
        String caseId,
        String driverId,
        String decisionType,
        String reason,
        String messageToDriver,
        String officerName,
        String officerCode
    ) {
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("message_id", "msg-dec-" + UUID.randomUUID().toString().substring(0, 8));
            payload.put("case_id", caseId);
            payload.put("driver_id", driverId != null ? driverId : "DRV-UNKNOWN");
            payload.put("decision_type", decisionType);
            payload.put("reason", reason);
            payload.put("message_to_driver", messageToDriver);
            payload.put("officer_name", officerName);
            payload.put("officer_code", officerCode);
            payload.put("decided_at", Instant.now().toString());

            rabbitTemplate.convertAndSend(
                RabbitMqConfig.EXCHANGE_NAME,
                RabbitMqConfig.ROUTING_KEY_DECISION_FINALIZED,
                payload
            );
            log.info("[RABBITMQ_ADMIN_PUBLISH] Published decision for case {} ({}) to {}", caseId, decisionType, RabbitMqConfig.ROUTING_KEY_DECISION_FINALIZED);
        } catch (Exception e) {
            log.error("Failed to publish decision finalized to RabbitMQ for case {}: {}", caseId, e.getMessage(), e);
        }
    }
}
