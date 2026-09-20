package com.greensm.compliance.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "telematics_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TelematicsLog {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id")
    private FraudCase fraudCase;

    @Column(name = "log_time", nullable = false, length = 20)
    private String time;

    @Column(nullable = false, length = 150)
    private String event;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(length = 20)
    private String severity; // high, medium, info
}
