package com.greensm.compliance.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DecisionType {
    THA_LOI("tha_loi", "Tha lỗi / Miễn trách nhiệm"),
    CANH_CAO("canh_cao", "Cảnh cáo & Nhắc nhở quy chế"),
    YEU_CAU_BO_SUNG("yeu_cau_bo_sung", "Yêu cầu bổ sung chứng cứ"),
    XU_PHAT_TIEN("xu_phat_tien", "Phạt tiền / Truy thu thưởng"),
    TAM_KHOA("tam_khoa", "Tạm khóa tài khoản"),
    KHOA_VINH_VIEN("khoa_vinh_vien", "Khóa vĩnh viễn / Hủy hợp đồng");

    private final String code;
    private final String defaultLabel;

    DecisionType(String code, String defaultLabel) {
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
    public static DecisionType fromCode(String code) {
        if (code == null) return null;
        for (DecisionType type : values()) {
            if (type.code.equalsIgnoreCase(code) || type.name().equalsIgnoreCase(code)) {
                return type;
            }
        }
        return THA_LOI;
    }
}
