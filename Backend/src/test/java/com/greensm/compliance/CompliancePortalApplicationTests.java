package com.greensm.compliance;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.greensm.compliance.domain.enums.DecisionType;
import com.greensm.compliance.domain.enums.OperatorStatus;
import com.greensm.compliance.dto.request.DecisionRequestDto;
import com.greensm.compliance.dto.request.OperatorStatusRequestDto;
import com.greensm.compliance.dto.request.RequestEvidenceDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class CompliancePortalApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Kiểm tra API lấy danh sách hồ sơ - Lọc da_nop_cho_duyet")
    void testGetPendingCases() throws Exception {
        mockMvc.perform(get("/compliance/cases")
                .param("status", "da_nop_cho_duyet"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].id").value("GL-8842"))
            .andExpect(jsonPath("$[0].driver.cccd").value("001094012845"));
    }

    @Test
    @DisplayName("Kiểm tra API lấy chi tiết hồ sơ GL-8842 kèm chứng cứ Telematics")
    void testGetCaseDetail() throws Exception {
        mockMvc.perform(get("/compliance/cases/GL-8842"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("GL-8842"))
            .andExpect(jsonPath("$.evidence.tripId").value("TRIP-99014"))
            .andExpect(jsonPath("$.explanation.explanationId").value("EXP-4401"));
    }

    @Test
    @DisplayName("Kiểm tra API ban hành phán quyết thẩm định tha lỗi")
    void testSubmitDecision() throws Exception {
        DecisionRequestDto request = DecisionRequestDto.builder()
            .decisionType(DecisionType.THA_LOI)
            .reason("Chấp nhận giải trình sự cố sạc pin")
            .messageToDriver("Hồ sơ đã được tha lỗi, bảo lưu điểm tín nhiệm.")
            .officerName("Nguyễn Mai Chi")
            .officerCode("GSM-INSPECT-88")
            .build();

        mockMvc.perform(post("/compliance/cases/GL-8842/decision")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("da_tha_loi"))
            .andExpect(jsonPath("$.decision.decisionType").value("tha_loi"));
    }

    @Test
    @DisplayName("Kiểm tra API yêu cầu tài xế bổ sung chứng cứ kỹ thuật")
    void testRequestMoreEvidence() throws Exception {
        RequestEvidenceDto request = RequestEvidenceDto.builder()
            .note("Yêu cầu gửi bổ sung ảnh chụp đồng hồ công tơ điện trong 24h")
            .build();

        mockMvc.perform(post("/compliance/cases/GL-8843/request-evidence")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("yeu_cau_bo_sung"));
    }

    @Test
    @DisplayName("Kiểm tra API chỉ số KPI Dashboard")
    void testGetComplianceMetrics() throws Exception {
        mockMvc.perform(get("/compliance/metrics"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.totalCases").isNumber())
            .andExpect(jsonPath("$.slaCompliancePercent").value(96.4));
    }

    @Test
    @DisplayName("Kiểm tra API tra cứu danh bạ tài xế theo CCCD 12 số")
    void testGetDriverByCccd() throws Exception {
        mockMvc.perform(get("/compliance/drivers/001094012845"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("TX-0921"))
            .andExpect(jsonPath("$.cccd").value("001094012845"))
            .andExpect(jsonPath("$.plate").value("29E-521.84"));
    }

    @Test
    @DisplayName("Kiểm tra API thông tin chuyên viên kiểm soát và cập nhật trạng thái trực ca")
    void testOperatorProfileAndStatus() throws Exception {
        mockMvc.perform(get("/operator/profile"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.code").value("GSM-INSPECT-88"));

        OperatorStatusRequestDto statusReq = OperatorStatusRequestDto.builder()
            .status(OperatorStatus.BREAK)
            .build();

        mockMvc.perform(patch("/operator/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(statusReq)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("break"));
    }

    @Test
    @DisplayName("Kiểm tra API thông báo ca trực và đánh dấu đã đọc")
    void testNotifications() throws Exception {
        mockMvc.perform(get("/notifications"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].id").isNotEmpty());

        mockMvc.perform(post("/notifications/notif-1/read"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.success").value(true));
    }
}
