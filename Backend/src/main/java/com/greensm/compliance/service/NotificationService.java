package com.greensm.compliance.service;

import com.greensm.compliance.domain.SystemNotification;
import com.greensm.compliance.dto.response.NotificationDto;
import com.greensm.compliance.repository.NotificationRepository;
import com.greensm.compliance.service.mapper.EntityMapper;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public List<NotificationDto> getNotifications() {
        return notificationRepository.findAllByOrderByIdDesc().stream()
            .map(EntityMapper::toNotificationDto)
            .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(String id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
    }
}
