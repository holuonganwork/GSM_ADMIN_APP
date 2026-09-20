package com.greensm.compliance.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemNotification {

    @Id
    @Column(length = 50)
    private String id; // notif-1

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "notification_desc", columnDefinition = "TEXT", nullable = false)
    private String desc;

    @Column(name = "notif_time", length = 50)
    private String time;

    @Builder.Default
    @Column(length = 20)
    private String type = "info"; // danger, warning, info, success

    @Builder.Default
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;

    @Column(name = "case_id", length = 50)
    private String caseId;
}
