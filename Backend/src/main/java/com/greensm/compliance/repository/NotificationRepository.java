package com.greensm.compliance.repository;

import com.greensm.compliance.domain.SystemNotification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<SystemNotification, String> {
    List<SystemNotification> findAllByOrderByIdDesc();
}
