package com.greensm.compliance.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FraudType {
    CUOC_AO("cuoc_ao", "Gian lận cuốc ảo (Bonus Hunting)"),
    GPS_SPOOFING("gps_spoofing", "Giả lập vị trí GPS (Mock Location)"),
    GIAN_LAN_VOUCHER("gian_lan_voucher", "Trục lợi mã giảm giá Voucher"),
    THU_CUOC_SAI("thu_cuoc_sai", "Thu cước sai / Thu ngoài app"),
    TAT_DINH_VI("tat_dinh_vi", "Cố tình ngắt T-Box Telematics"),
    KHAC("khac", "Vi phạm tuân thủ khác");

    private final String code;
    private final String defaultLabel;

    FraudType(String code, String defaultLabel) {
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
    public static FraudType fromCode(String code) {
        if (code == null) return null;
        for (FraudType type : values()) {
            if (type.code.equalsIgnoreCase(code) || type.name().equalsIgnoreCase(code)) {
                return type;
            }
        }
        return KHAC;
    }
}
