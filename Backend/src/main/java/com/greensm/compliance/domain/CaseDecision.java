package com.greensm.compliance.domain;

import com.greensm.compliance.domain.enums.DecisionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "case_decisions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaseDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", unique = true)
    private FraudCase fraudCase;

    @Enumerated(EnumType.STRING)
    @Column(name = "decision_type", nullable = false, length = 30)
    private DecisionType decisionType;

    @Column(name = "decided_at", length = 50)
    private String decidedAt;

    @Column(name = "officer_name", nullable = false, length = 100)
    private String officerName;

    @Column(name = "officer_code", nullable = false, length = 50)
    private String officerCode;

    @Builder.Default
    @Column(name = "fine_amount")
    private Integer fineAmount = 0;

    @Builder.Default
    @Column(name = "suspension_days")
    private Integer suspensionDays = 0;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(name = "message_to_driver", columnDefinition = "TEXT", nullable = false)
    private String messageToDriver;
}
