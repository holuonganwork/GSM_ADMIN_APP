package com.greensm.compliance.controller;

import com.greensm.compliance.dto.response.NotificationDto;
import com.greensm.compliance.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications API", description = "Cảnh báo vi phạm mới và thông báo giải trình từ tài xế")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Lấy danh sách các cảnh báo và thông báo ca trực")
    public ResponseEntity<List<NotificationDto>> getNotifications() {
        List<NotificationDto> list = notificationService.getNotifications();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/{id}/read")
    @Operation(summary = "Đánh dấu thông báo đã đọc")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable("id") String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("success", true, "id", id));
    }
}
