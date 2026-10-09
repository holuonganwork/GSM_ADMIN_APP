/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GSM Compliance & Fraud Investigation API Client
 */

import {
  FraudCase,
  ComplianceMetrics,
  CaseDecision,
  DriverComplianceInfo,
  AppNotification,
  OperatorProfile,
} from '../types';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Sanitize input strings to prevent XSS attacks and clean junk/untrusted data.
 */
export function sanitizeInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags & content
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags & content
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')   // Remove style tags & content
    .replace(/<[^>]+>/g, '')                                            // Remove HTML tags
    .replace(/javascript:/gi, '')                                       // Remove javascript: URI
    .trim();
}

/**
 * Validates 12-digit Vietnamese CCCD format
 */
export function isValidCccd(cccd: string): boolean {
  if (!cccd) return false;
  return /^\d{12}$/.test(cccd.trim());
}

export async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { timeoutMs = 8000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Lỗi API (${response.status}): ${response.statusText}`
      );
    }

    return await response.json();
  } catch (err: unknown) {
    clearTimeout(id);
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        throw new Error(`Quá thời gian chờ phản hồi từ máy chủ (${timeoutMs}ms)`);
      }
      throw err;
    }
    throw new Error('Lỗi không xác định khi gọi API');
  }
}

// ----------------- Compliance & Fraud Cases API -----------------
export const complianceApi = {
  async getCases(params?: {
    status?: string;
    fraudType?: string;
    severity?: string;
    search?: string;
  }): Promise<FraudCase[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.fraudType && params.fraudType !== 'all') query.set('fraudType', params.fraudType);
    if (params?.severity && params.severity !== 'all') query.set('severity', params.severity);
    if (params?.search) query.set('search', params.search.trim());

    const qs = query.toString();
    return fetchApi<FraudCase[]>(`/compliance/cases${qs ? `?${qs}` : ''}`);
  },

  async getCaseById(id: string): Promise<FraudCase> {
    return fetchApi<FraudCase>(`/compliance/cases/${encodeURIComponent(id)}`);
  },

  async submitDecision(
    id: string,
    decision: Omit<CaseDecision, 'decidedAt' | 'officerName' | 'officerCode'> & {
      officerName?: string;
      officerCode?: string;
    }
  ): Promise<FraudCase> {
    const sanitizedPayload = {
      ...decision,
      reason: sanitizeInput(decision.reason),
      messageToDriver: sanitizeInput(decision.messageToDriver),
      officerName: decision.officerName ? sanitizeInput(decision.officerName) : undefined,
      officerCode: decision.officerCode ? sanitizeInput(decision.officerCode) : undefined,
    };
    return fetchApi<FraudCase>(`/compliance/cases/${encodeURIComponent(id)}/decision`, {
      method: 'POST',
      body: JSON.stringify(sanitizedPayload),
    });
  },

  async requestMoreEvidence(id: string, note: string): Promise<FraudCase> {
    return fetchApi<FraudCase>(`/compliance/cases/${encodeURIComponent(id)}/request-evidence`, {
      method: 'POST',
      body: JSON.stringify({ note: sanitizeInput(note) }),
    });
  },

  async getMetrics(): Promise<ComplianceMetrics> {
    return fetchApi<ComplianceMetrics>('/compliance/metrics');
  },

  async getDriverByCccd(cccd: string): Promise<DriverComplianceInfo> {
    const cleanCccd = cccd.trim();
    return fetchApi<DriverComplianceInfo>(`/compliance/drivers/${encodeURIComponent(cleanCccd)}`);
  },

  async getAllDrivers(search?: string): Promise<DriverComplianceInfo[]> {
    const qs = search ? `?search=${encodeURIComponent(search.trim())}` : '';
    return fetchApi<DriverComplianceInfo[]>(`/compliance/drivers${qs}`);
  },
};

// ----------------- Operator & Notifications API -----------------
export const operatorApi = {
  async getProfile(): Promise<OperatorProfile> {
    return fetchApi<OperatorProfile>('/operator/profile');
  },

  async updateStatus(status: 'online' | 'break' | 'busy'): Promise<OperatorProfile> {
    return fetchApi<OperatorProfile>('/operator/status', {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

export const notificationApi = {
  async getNotifications(): Promise<AppNotification[]> {
    return fetchApi<AppNotification[]>('/notifications');
  },

  async markAsRead(id: string | number): Promise<void> {
    return fetchApi<void>(`/notifications/${encodeURIComponent(String(id))}/read`, {
      method: 'POST',
    });
  },
};

// Compatibility aliases for App components
export const ticketApi = {
  getTickets: complianceApi.getCases,
  getTicketById: complianceApi.getCaseById,
  closeTicket: async (id: string) => complianceApi.submitDecision(id, {
    decisionType: 'tha_loi',
    reason: 'Hoàn tất thẩm định',
    messageToDriver: 'Hồ sơ của bạn đã được đóng và xử lý.',
  }),
};

export const metricsApi = {
  getShiftMetrics: complianceApi.getMetrics,
};
