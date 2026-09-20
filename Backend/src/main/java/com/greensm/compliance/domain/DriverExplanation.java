package com.greensm.compliance.domain;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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
@Table(name = "driver_explanations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverExplanation {

    @Id
    @Column(length = 50)
    private String id; // Matches explanationId trên Frontend (vd: EXP-4401)

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id", unique = true)
    private FraudCase fraudCase;

    @Column(name = "submitted_at", length = 50)
    private String submittedAt;

    @Column(name = "reason_category", nullable = false, length = 150)
    private String reasonCategory;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    @Column(length = 30)
    private String status = "da_nop_cho_duyet";

    @Builder.Default
    @OneToMany(mappedBy = "explanation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ExplanationAttachment> attachments = new ArrayList<>();
}
