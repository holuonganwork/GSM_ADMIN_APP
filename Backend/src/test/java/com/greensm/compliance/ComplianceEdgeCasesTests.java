package com.greensm.compliance;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.greensm.compliance.dto.request.DecisionRequestDto;
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
class ComplianceEdgeCasesTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Kiểm tra lỗi 404 khi truy vấn hồ sơ không tồn tại")
    void testCaseNotFoundReturns404() throws Exception {
        mockMvc.perform(get("/compliance/cases/GL-NON-EXISTENT"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Kiểm tra lỗi 404 khi tra cứu CCCD không tồn tại")
    void testDriverCccdNotFoundReturns404() throws Exception {
        mockMvc.perform(get("/compliance/drivers/999999999999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Kiểm tra lỗi 400 khi gửi quyết định thiếu thông tin bắt buộc")
    void testSubmitInvalidDecisionReturns400() throws Exception {
        // Missing decisionType and reason
        DecisionRequestDto invalidDto = DecisionRequestDto.builder()
            .officerName("Nguyễn Mai Chi")
            .build();

        mockMvc.perform(post("/compliance/cases/GL-8842/decision")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidDto)))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Kiểm tra lọc danh sách hồ sơ với bộ lọc không khớp (trả về danh sách rỗng)")
    void testFilterNoMatchingCases() throws Exception {
        mockMvc.perform(get("/compliance/cases")
                .param("search", "KHONG_TON_TAI_TRONG_HE_THONG_123456"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(0));
    }
}
