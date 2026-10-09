package com.greensm.compliance.service;

import com.greensm.compliance.domain.Operator;
import com.greensm.compliance.domain.SystemNotification;
import com.greensm.compliance.domain.enums.OperatorStatus;
import com.greensm.compliance.repository.NotificationRepository;
import com.greensm.compliance.repository.OperatorRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializerService implements CommandLineRunner {

    private final OperatorRepository operatorRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Khởi tạo cấu hình ban đầu cho hệ thống GSM Compliance Desk...");
        seedOperator();
        seedNotifications();
        log.info("Hoàn tất khởi tạo hệ thống tuân thủ GSM (Không nạp mock data)!");
    }

    private void seedOperator() {
        if (operatorRepository.existsById("op-001")) return;

        Operator op = Operator.builder()
            .id("op-001")
            .name("Nguyễn Mai Chi")
            .code("GSM-INSPECT-88")
            .role("Chuyên viên Ban Kiểm Soát Tuân Thủ")
            .shift("Ca sáng")
            .shiftTime("07:00 - 15:00")
            .avatarUrl("/avatar-chi.svg")
            .status(OperatorStatus.ONLINE)
            .build();
        operatorRepository.save(op);
    }

    private void seedNotifications() {
        if (notificationRepository.count() > 0) return;

        List<SystemNotification> notifs = List.of(
            SystemNotification.builder()
                .id("notif-1")
                .title("Cổng thẩm định tuân thủ GSM sẵn sàng")
                .desc("Hệ thống đã kết nối trực tiếp với PostgreSQL gsm_simulator và RabbitMQ broker.")
                .time("Vừa xong")
                .type("info")
                .isRead(false)
                .build()
        );
        notificationRepository.saveAll(notifs);
    }
}
