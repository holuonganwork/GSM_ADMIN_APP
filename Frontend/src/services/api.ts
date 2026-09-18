/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Ticket,
  ShiftMetrics,
  DriverConversation,
  ChatMessage,
  DriverDirectoryItem,
  FleetTelemetryPoint,
  AppNotification,
  OperatorProfile,
  ResolutionData,
} from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * Core HTTP client with timeout and unified error handling
 */
async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
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

// ----------------- Ticket API -----------------
export const ticketApi = {
  async getTickets(params?: {
    status?: string;
    priority?: string;
    vehicle?: string;
    search?: string;
  }): Promise<Ticket[]> {
    const query = new URLSearchParams();
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.priority && params.priority !== 'all') query.set('priority', params.priority);
    if (params?.vehicle && params.vehicle !== 'all') query.set('vehicle', params.vehicle);
    if (params?.search) query.set('search', params.search);

    const qs = query.toString();
    return fetchApi<Ticket[]>(`/tickets${qs ? `?${qs}` : ''}`);
  },

  async getTicketById(id: string): Promise<Ticket> {
    return fetchApi<Ticket>(`/tickets/${encodeURIComponent(id)}`);
  },

  async createTicket(ticket: Partial<Ticket>): Promise<Ticket> {
    return fetchApi<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticket),
    });
  },

  async updateTicket(id: string, updates: Partial<Ticket>): Promise<Ticket> {
    return fetchApi<Ticket>(`/tickets/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async closeTicket(id: string, resolution?: Partial<ResolutionData>): Promise<Ticket> {
    return fetchApi<Ticket>(`/tickets/${encodeURIComponent(id)}/close`, {
      method: 'POST',
      body: JSON.stringify(resolution || {}),
    });
  },
};

// ----------------- Shift Metrics API -----------------
export const metricsApi = {
  async getShiftMetrics(): Promise<ShiftMetrics> {
    return fetchApi<ShiftMetrics>('/metrics/shift');
  },
};

// ----------------- Driver Chat API -----------------
export const chatApi = {
  async getConversations(): Promise<DriverConversation[]> {
    return fetchApi<DriverConversation[]>('/chat/conversations');
  },

  async getMessages(conversationId: string | number): Promise<ChatMessage[]> {
    return fetchApi<ChatMessage[]>(`/chat/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string | number, text: string): Promise<ChatMessage> {
    return fetchApi<ChatMessage>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};

// ----------------- Fleet Telematics & Map API -----------------
export const fleetApi = {
  async getFleetPoints(filter?: string): Promise<FleetTelemetryPoint[]> {
    const qs = filter && filter !== 'all' ? `?filter=${encodeURIComponent(filter)}` : '';
    return fetchApi<FleetTelemetryPoint[]>(`/fleet/points${qs}`);
  },
};

// ----------------- Driver Directory API -----------------
export const driverApi = {
  async getDrivers(search?: string): Promise<DriverDirectoryItem[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    return fetchApi<DriverDirectoryItem[]>(`/drivers${qs}`);
  },
};

// ----------------- Notifications API -----------------
export const notificationApi = {
  async getNotifications(): Promise<AppNotification[]> {
    return fetchApi<AppNotification[]>('/notifications');
  },

  async markAsRead(id: string | number): Promise<void> {
    return fetchApi<void>(`/notifications/${id}/read`, {
      method: 'POST',
    });
  },
};

// ----------------- Operator Profile API -----------------
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

// ----------------- System Health API -----------------
export const systemApi = {
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    return fetchApi<{ status: string; timestamp: string }>('/health', { timeoutMs: 3000 });
  },
};
