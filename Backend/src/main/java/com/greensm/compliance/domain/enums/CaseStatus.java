package com.greensm.compliance.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CaseStatus {
    DA_NOP_CHO_DUYET("da_nop_cho_duyet", "Đã nộp giải trình - Chờ duyệt"),
    YEU_CAU_BO_SUNG("yeu_cau_bo_sung", "Yêu cầu bổ sung chứng cứ"),
    DA_THA_LOI("da_tha_loi", "Đã tha lỗi / Minh oan"),
    DA_CANH_CAO("da_canh_cao", "Đã nhắc nhở & cảnh cáo"),
    DA_XU_PHAT("da_xu_phat", "Đã xử phạt vi phạm"),
    CHO_TAI_XE_GIAI_TRINH("cho_tai_xe_giai_trinh", "Chờ tài xế giải trình");

    private final String code;
    private final String defaultLabel;

    CaseStatus(String code, String defaultLabel) {
        this.code = code;
        this.defaultLabel = defaultLabel;
    }

    @JsonValue
    public String getCode() {
        return code;
    }

    public String getDefaultLabel() {
        return defaultLabel;
    }

    @JsonCreator
    public static CaseStatus fromCode(String code) {
        if (code == null) return null;
        for (CaseStatus status : values()) {
            if (status.code.equalsIgnoreCase(code) || status.name().equalsIgnoreCase(code)) {
                return status;
            }
        }
        return DA_NOP_CHO_DUYET;
    }
}
