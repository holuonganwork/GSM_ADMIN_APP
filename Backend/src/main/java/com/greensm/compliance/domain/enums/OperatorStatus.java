package com.greensm.compliance.domain.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum OperatorStatus {
    ONLINE("online", "Trực ca / Sẵn sàng"),
    BREAK("break", "Nghỉ giải lao"),
    BUSY("busy", "Đang bận thẩm định");

    private final String code;
    private final String defaultLabel;

    OperatorStatus(String code, String defaultLabel) {
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
    public static OperatorStatus fromCode(String code) {
        if (code == null) return null;
        for (OperatorStatus status : values()) {
            if (status.code.equalsIgnoreCase(code) || status.name().equalsIgnoreCase(code)) {
                return status;
            }
        }
        return ONLINE;
    }
}
