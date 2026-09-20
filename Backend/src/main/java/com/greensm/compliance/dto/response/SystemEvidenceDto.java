package com.greensm.compliance.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SystemEvidenceDto {
    private String tripId;
    private String tripCode;
    private String detectedAt;
    private String anomalyTitle;
    private String anomalyDescription;
    private Integer fareAmount;
    private Integer voucherAmount;
    private Integer bonusClaimed;
    private String pickup;
    private String dropoff;
    private Double gpsDistanceKm;
    private Double telematicsActualKm;
    private Double maxSpeedKmh;
    private Boolean deviceImeiSameAsCustomer;
    private List<TelematicsLogDto> telematicsLogs;
}
