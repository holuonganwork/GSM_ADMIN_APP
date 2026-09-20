package com.greensm.compliance.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TelematicsLogDto {
    private String id;
    private String time;
    private String event;
    private String detail;
    private String severity;
}
