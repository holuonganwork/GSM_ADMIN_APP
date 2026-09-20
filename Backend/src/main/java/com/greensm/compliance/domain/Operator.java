package com.greensm.compliance.domain;

import com.greensm.compliance.domain.enums.OperatorStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "operators")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Operator {

    @Id
    @Column(length = 50)
    private String id; // op-001

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String code; // GSM-INSPECT-88

    @Column(nullable = false, length = 150)
    private String role;

    @Column(nullable = false, length = 50)
    private String shift;

    @Column(name = "shift_time", nullable = false, length = 50)
    private String shiftTime;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OperatorStatus status = OperatorStatus.ONLINE;
}
