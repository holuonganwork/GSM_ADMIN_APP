package com.greensm.compliance.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "drivers",
    indexes = {
        @Index(name = "idx_drivers_cccd", columnList = "cccd", unique = true),
        @Index(name = "idx_drivers_plate", columnList = "plate")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @Column(length = 50)
    private String id; // Mã tài xế (vd: TX-0921)

    @NotBlank(message = "Tên tài xế không được để trống")
    @Column(nullable = false, length = 100)
    private String name;

    @NotBlank(message = "Số CCCD không được để trống")
    @Pattern(regexp = "^[0-9]{12}$", message = "Số CCCD bắt buộc đúng 12 chữ số")
    @Column(nullable = false, unique = true, length = 12)
    private String cccd; // Bắt buộc 12 chữ số - Tuyệt đối không có trường đội xe (team/fleet)

    @NotBlank(message = "Số điện thoại không được để trống")
    @Column(nullable = false, length = 20)
    private String phone;

    @NotBlank(message = "Biển số xe không được để trống")
    @Column(nullable = false, length = 20)
    private String plate;

    @NotBlank(message = "Dòng xe VinFast không được để trống")
    @Column(name = "vehicle_model", nullable = false, length = 50)
    private String vehicleModel;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Builder.Default
    @Column(name = "trust_score", nullable = false)
    private Integer trustScore = 100;

    @Builder.Default
    @Column(name = "prior_violations_count", nullable = false)
    private Integer priorViolationsCount = 0;

    @Builder.Default
    @Column(name = "completed_rides", nullable = false)
    private Integer completedRides = 0;

    @Builder.Default
    @Column(nullable = false)
    private Double rating = 5.0;
}
