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
public class DriverExplanationDto {
    private String explanationId;
    private String submittedAt;
    private String reasonCategory;
    private String content;
    private List<ExplanationAttachmentDto> attachments;
    private String status;
}
