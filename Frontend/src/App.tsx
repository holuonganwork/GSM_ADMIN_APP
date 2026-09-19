/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Green SM Operations Portal - Fraud Investigation & Compliance Desk
 * Cổng Kiểm Soát Tuân Thủ & Thẩm Định Giải Trình Gian Lận GSM
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { TicketQueue } from './components/TicketQueue';
import { TicketDetail } from './components/TicketDetail';
import { CaseHistoryView } from './components/views/CaseHistoryView';
import { DriverDirectoryView } from './components/views/DriverDirectoryView';
import { SLAReportView } from './components/views/SLAReportView';
import { DriverCallModal } from './components/modals/DriverCallModal';
import { ExportShiftModal } from './components/modals/ExportShiftModal';

import {
  FraudCase,
  CaseStatus,
  ComplianceMetrics,
  OperatorProfile,
  AppNotification,
  emptyComplianceMetrics,
  defaultOperatorProfile,
} from './types';
import { complianceApi, operatorApi, notificationApi } from './services/api';
import { seedFraudCases, seedComplianceMetrics } from './data/mockTickets';
import { CheckCircle2, ShieldAlert, RefreshCw, Sparkles, WifiOff, AlertTriangle } from 'lucide-react';

// Helper to identify processed/decided/supplementary cases that belong to History
const isCaseProcessed = (c: FraudCase) =>
  c.status === 'da_tha_loi' ||
  c.status === 'da_xu_phat' ||
  c.status === 'da_canh_cao' ||
  c.status === 'yeu_cau_bo_sung';

export default function App() {
  // Navigation & Layout
  const [currentTab, setCurrentTab] = useState<NavTab>('cases');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gsm_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('gsm_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Main Fraud Investigation States
  const [cases, setCases] = useState<FraudCase[]>([]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ComplianceMetrics>(emptyComplianceMetrics);
  const [operatorProfile, setOperatorProfile] = useState<OperatorProfile>(defaultOperatorProfile);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // System & Connection States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFraudType, setSelectedFraudType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  // Modals
  const [callModal, setCallModal] = useState<{ isOpen: boolean; name: string; phone: string }>({
    isOpen: false,
    name: '',
    phone: '',
  });
  const [isExportShiftOpen, setIsExportShiftOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3800);
  };

  // Load live data from Backend API
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setBackendStatus('connecting');

    try {
      const [casesResult, metricsResult, profileResult, notificationsResult] = await Promise.allSettled([
        complianceApi.getCases(),
        complianceApi.getMetrics(),
        operatorApi.getProfile(),
        notificationApi.getNotifications(),
      ]);

      let hasSuccess = false;

      if (casesResult.status === 'fulfilled') {
        setCases(casesResult.value);
        const pending = casesResult.value.filter((c: FraudCase) => c.status === 'da_nop_cho_duyet');
        if (pending.length > 0) {
          setSelectedCaseId(pending[0].id);
        } else if (casesResult.value.length > 0) {
          setSelectedCaseId(casesResult.value[0].id);
        }
        hasSuccess = true;
      }

      if (metricsResult.status === 'fulfilled') {
        setMetrics(metricsResult.value);
        hasSuccess = true;
      }

      if (profileResult.status === 'fulfilled') {
        setOperatorProfile(profileResult.value);
        hasSuccess = true;
      }

      if (notificationsResult.status === 'fulfilled') {
        setNotifications(notificationsResult.value);
        hasSuccess = true;
      }

      if (hasSuccess) {
        setBackendStatus('connected');
        setIsDemoMode(false);
      } else {
        setBackendStatus('disconnected');
      }
    } catch {
      setBackendStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Seed demo data helper
  const handleLoadDemoData = () => {
    setCases(seedFraudCases);
    setMetrics(seedComplianceMetrics);
    const pending = seedFraudCases.filter((c) => c.status === 'da_nop_cho_duyet');
    setSelectedCaseId(pending.length > 0 ? pending[0].id : null);
    setIsDemoMode(true);
    showToast('Đã nạp 7 hồ sơ gian lận & biên bản giải trình mẫu để thẩm định!');
  };

  // Clear demo data
  const handleClearData = () => {
    setCases([]);
    setMetrics(emptyComplianceMetrics);
    setSelectedCaseId(null);
    setIsDemoMode(false);
    showToast('Đã dọn sạch dữ liệu về trạng thái ban đầu.');
  };

  // Partition cases: Pending contains ONLY 'da_nop_cho_duyet'
  const pendingCases = cases.filter((c) => c.status === 'da_nop_cho_duyet');
  const historyCases = cases.filter((c) => isCaseProcessed(c));

  // Filtered pending cases for the main desk
  const filteredCases = pendingCases.filter((c) => {
    if (searchQuery.trim() && currentTab === 'cases') {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchPlate = c.driver.plate.toLowerCase().includes(q);
      const matchCccd = c.driver.cccd.toLowerCase().includes(q);
      const matchDriver = c.driver.name.toLowerCase().includes(q);
      const matchType = c.fraudTypeLabel.toLowerCase().includes(q);
      if (!matchId && !matchPlate && !matchCccd && !matchDriver && !matchType) return false;
    }

    if (selectedFraudType !== 'all' && c.fraudType !== selectedFraudType) {
      return false;
    }

    if (selectedSeverity !== 'all' && c.severity !== selectedSeverity) {
      return false;
    }

    return true;
  });

  // Selected case for the main desk (only from pending cases)
  const selectedCase = pendingCases.find((c) => c.id === selectedCaseId) || (pendingCases.length > 0 ? pendingCases[0] : null);

  // Update case decision
  const handleUpdateCase = async (updatedCase: FraudCase) => {
    setCases((prev) => prev.map((c) => (c.id === updatedCase.id ? updatedCase : c)));

    // If the case becomes processed or supplementary requested, automatically pick the next pending case for the main desk
    if (isCaseProcessed(updatedCase)) {
      const remainingPending = pendingCases.filter((c) => c.id !== updatedCase.id);
      if (remainingPending.length > 0) {
        setSelectedCaseId(remainingPending[0].id);
      } else {
        setSelectedCaseId(null);
      }
    }

    // Update local metrics
    setMetrics((prev) => {
      let pendingDelta = 0;
      let exoneratedDelta = 0;
      let penalizedDelta = 0;
      let finesDelta = 0;

      if (updatedCase.status === 'da_tha_loi') {
        pendingDelta = -1;
        exoneratedDelta = 1;
      } else if (updatedCase.status === 'da_xu_phat') {
        pendingDelta = -1;
        penalizedDelta = 1;
        finesDelta = updatedCase.decision?.fineAmount || 0;
      } else if (updatedCase.status === 'da_canh_cao') {
        pendingDelta = -1;
        penalizedDelta = 1;
      } else if (updatedCase.status === 'yeu_cau_bo_sung') {
        pendingDelta = -1;
      }

      return {
        ...prev,
        pendingReview: Math.max(0, prev.pendingReview + pendingDelta),
        exoneratedCount: prev.exoneratedCount + exoneratedDelta,
        penalizedCount: prev.penalizedCount + penalizedDelta,
        totalFinesRecovered: prev.totalFinesRecovered + finesDelta,
      };
    });

    if (updatedCase.status === 'yeu_cau_bo_sung') {
      showToast(`Đã chuyển hồ sơ #${updatedCase.id} sang Lịch Sử với yêu cầu bổ sung chứng cứ.`);
    } else {
      showToast(`Đã lưu quyết định: ${updatedCase.statusLabel} cho hồ sơ #${updatedCase.id}`);
    }

    // Call Backend
    try {
      if (updatedCase.decision) {
        await complianceApi.submitDecision(updatedCase.id, updatedCase.decision);
      }
    } catch {
      // Local state preserved
    }
  };

  const handleCloseCase = (caseId: string) => {
    const targetCase = cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    const closedCase: FraudCase = {
      ...targetCase,
      status: 'da_tha_loi',
      statusLabel: 'Đã hoàn tất thẩm định (Đóng vụ án)',
    };

    handleUpdateCase(closedCase);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f8f9ff] text-[#121c28]">
      {/* Global Toast */}
      {globalToast && (
        <div className="fixed top-16 right-6 z-60 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-[#20B9BE]" />
          <span>{globalToast}</span>
        </div>
      )}

      {/* Backend Offline Banner */}
      {backendStatus === 'disconnected' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-amber-800 z-40">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span>
              <strong>Máy chủ Backend (/api):</strong> Chưa kết nối với dịch vụ backend. Bạn có thể nạp bộ dữ liệu mẫu thực tế để trải nghiệm thẩm định hồ sơ gian lận.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isDemoMode ? (
              <button
                onClick={handleLoadDemoData}
                className="px-2.5 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Sparkles className="w-3 h-3" />
                Nạp hồ sơ mẫu thẩm định
              </button>
            ) : (
              <button
                onClick={handleClearData}
                className="px-2.5 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium text-[11px] cursor-pointer transition-colors"
              >
                Xóa dữ liệu mẫu
              </button>
            )}
            <button
              onClick={loadInitialData}
              className="px-2.5 py-0.5 bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 rounded font-medium text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              Thử kết nối lại
            </button>
          </div>
        </div>
      )}

      {/* Top Header - Cross-tab agile search */}
      <Header
        currentTab={currentTab}
        operatorProfile={operatorProfile}
        onUpdateOperatorStatus={(status) => {
          setOperatorProfile((prev) => ({ ...prev, status }));
          showToast(`Đã cập nhật trạng thái: ${status === 'online' ? 'Sẵn sàng thẩm định' : status === 'break' ? 'Nghỉ giải lao' : 'Hội ý phán quyết'}`);
          operatorApi.updateStatus(status).catch(() => {});
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFraudType={selectedFraudType}
        onFraudTypeChange={setSelectedFraudType}
        selectedSeverity={selectedSeverity}
        onSeverityChange={setSelectedSeverity}
      />

      {/* Main Layout: Sidebar + Desk Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          caseCount={cases.length}
          pendingCount={pendingCases.length}
          historyCount={historyCases.length}
          metrics={metrics}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Center Content Workspace */}
        <main className="flex-1 flex flex-col overflow-hidden p-3.5 bg-[#f8f9ff]">
          {/* Tab 1: Pending Cases Queue & Investigation Desk */}
          {currentTab === 'cases' && (
            <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden min-h-0">
              {/* Left: Queue of Pending Fraud Cases with Status Tabs */}
              <TicketQueue
                tickets={filteredCases}
                selectedTicketId={selectedCase?.id || ''}
                onSelectTicket={(c) => setSelectedCaseId(c.id)}
                isLoading={isLoading}
                pendingCount={pendingCases.length}
                selectedFraudType={selectedFraudType}
                onFraudTypeChange={setSelectedFraudType}
                selectedSeverity={selectedSeverity}
                onSeverityChange={setSelectedSeverity}
                onResetFilters={() => {
                  setSelectedFraudType('all');
                  setSelectedSeverity('all');
                }}
                onExportReport={() => setIsExportShiftOpen(true)}
                onManualRefresh={() => {
                  loadInitialData();
                  showToast('Đang tải dữ liệu hồ sơ mới nhất từ máy chủ...');
                }}
              />

              {/* Right: Adjudication Workspace */}
              {selectedCase ? (
                <TicketDetail
                  ticket={selectedCase}
                  onUpdateTicket={handleUpdateCase}
                  onCallDriver={(name, phone) => setCallModal({ isOpen: true, name, phone })}
                  onCloseTicket={handleCloseCase}
                />
              ) : (
                <div className="flex-1 bg-white border border-slate-200/90 rounded-xl flex flex-col items-center justify-center p-8 text-center shadow-2xs">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <ShieldAlert className="w-7 h-7 text-[#008284]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">
                    {pendingCases.length === 0 ? 'Tất cả hồ sơ đã được xử lý!' : 'Chưa có hồ sơ nào được chọn'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm">
                    {pendingCases.length === 0
                      ? 'Hiện không còn hồ sơ nào đang chờ thẩm định. Các hồ sơ đã giải quyết đã được lưu trữ an toàn trong mục "Lịch Sử Phán Quyết & Xử Lý".'
                      : 'Vui lòng chọn một hồ sơ trong hàng đợi chờ thẩm định bên trái để kiểm tra giải trình và đối chiếu dữ liệu viễn thông.'}
                  </p>
                  {pendingCases.length === 0 && (
                    <button
                      onClick={() => setCurrentTab('case_history')}
                      className="mt-4 px-3.5 py-1.5 btn-gsm-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      Xem lịch sử phán quyết
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Case History & Adjudication Archive */}
          {currentTab === 'case_history' && (
            <CaseHistoryView
              cases={historyCases}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedFraudType={selectedFraudType}
              selectedSeverity={selectedSeverity}
              onCallDriver={(name, phone) => setCallModal({ isOpen: true, name, phone })}
            />
          )}

          {/* Tab 3: Driver Compliance & Trust Directory by CCCD */}
          {currentTab === 'driver_compliance' && (
            <DriverDirectoryView
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onCallDriver={(name, phone) => setCallModal({ isOpen: true, name, phone })}
            />
          )}

          {/* Tab 4: Fraud Analytics & SLA Report */}
          {currentTab === 'fraud_analytics' && (
            <SLAReportView
              metrics={metrics}
              tickets={cases}
              searchQuery={searchQuery}
            />
          )}
        </main>
      </div>

      {/* Driver Call Modal */}
      <DriverCallModal
        isOpen={callModal.isOpen}
        onClose={() => setCallModal({ ...callModal, isOpen: false })}
        driverName={callModal.name}
        driverPhone={callModal.phone}
      />

      {/* Export Shift Report Modal */}
      <ExportShiftModal
        isOpen={isExportShiftOpen}
        onClose={() => setIsExportShiftOpen(false)}
        metrics={metrics}
        operatorProfile={operatorProfile}
      />
    </div>
  );
}
