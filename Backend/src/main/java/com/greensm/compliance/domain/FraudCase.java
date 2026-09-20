package com.greensm.compliance.domain;

import com.greensm.compliance.domain.enums.CaseSeverity;
import com.greensm.compliance.domain.enums.CaseStatus;
import com.greensm.compliance.domain.enums.FraudType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "fraud_cases",
    indexes = {
        @Index(name = "idx_cases_status", columnList = "status"),
        @Index(name = "idx_cases_driver", columnList = "driver_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FraudCase {

    @Id
    @Column(length = 50)
    private String id; // vd: GL-8842

    @Enumerated(EnumType.STRING)
    @Column(name = "fraud_type", nullable = false, length = 50)
    private FraudType fraudType;

    @Column(name = "fraud_type_label", nullable = false, length = 100)
    private String fraudTypeLabel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CaseSeverity severity;

    @Column(name = "severity_label", nullable = false, length = 50)
    private String severityLabel;

    @Column(name = "created_at", length = 50)
    private String createdAt;

    @Column(name = "time_ago", length = 50)
    private String timeAgo;

    @Builder.Default
    @Column(name = "deadline_hours")
    private Integer deadlineHours = 24;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CaseStatus status;

    @Column(name = "status_label", nullable = false, length = 100)
    private String statusLabel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    // --- Chứng cứ kỹ thuật & Dữ liệu viễn thông Telematics ---
    @Column(name = "trip_id", length = 50)
    private String tripId;

    @Column(name = "trip_code", length = 100)
    private String tripCode;

    @Column(name = "detected_at", length = 50)
    private String detectedAt;

    @Column(name = "anomaly_title", columnDefinition = "TEXT", nullable = false)
    private String anomalyTitle;

    @Column(name = "anomaly_description", columnDefinition = "TEXT")
    private String anomalyDescription;

    @Builder.Default
    @Column(name = "fare_amount")
    private Integer fareAmount = 0;

    @Builder.Default
    @Column(name = "voucher_amount")
    private Integer voucherAmount = 0;

    @Builder.Default
    @Column(name = "bonus_claimed")
    private Integer bonusClaimed = 0;

    @Column(columnDefinition = "TEXT")
    private String pickup;

    @Column(columnDefinition = "TEXT")
    private String dropoff;

    @Column(name = "gps_distance_km")
    private Double gpsDistanceKm;

    @Column(name = "telematics_actual_km")
    private Double telematicsActualKm;

    @Column(name = "max_speed_kmh")
    private Double maxSpeedKmh;

    @Builder.Default
    @Column(name = "device_imei_same_as_customer")
    private Boolean deviceImeiSameAsCustomer = false;

    @Builder.Default
    @OneToMany(mappedBy = "fraudCase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<TelematicsLog> telematicsLogs = new ArrayList<>();

    // --- Giải trình & Quyết định ---
    @OneToOne(mappedBy = "fraudCase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private DriverExplanation explanation;

    @OneToOne(mappedBy = "fraudCase", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private CaseDecision decision;
}
