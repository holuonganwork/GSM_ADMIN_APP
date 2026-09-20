package com.greensm.compliance.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum CaseSeverity {
    NGHIEM_TRONG("nghiem_trong", "Nghiêm trọng"),
    TRUNG_BINH("trung_binh", "Trung bình"),
    NHE("nhe", "Nhẹ");

    private final String code;
    private final String defaultLabel;

    CaseSeverity(String code, String defaultLabel) {
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
    public static CaseSeverity fromCode(String code) {
        if (code == null) return null;
        for (CaseSeverity severity : values()) {
            if (severity.code.equalsIgnoreCase(code) || severity.name().equalsIgnoreCase(code)) {
                return severity;
            }
        }
        return TRUNG_BINH;
    }
}
