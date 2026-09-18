/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { KPICards } from './components/KPICards';
import { FilterToolbar } from './components/FilterToolbar';
import { TicketQueue } from './components/TicketQueue';
import { TicketDetail } from './components/TicketDetail';
import { FleetMapView } from './components/views/FleetMapView';
import { DriverDirectoryView } from './components/views/DriverDirectoryView';
import { SLAReportView } from './components/views/SLAReportView';
import { DriverChatInboxView } from './components/views/DriverChatInboxView';
import { CreateTicketModal } from './components/modals/CreateTicketModal';
import { DriverCallModal } from './components/modals/DriverCallModal';
import { DriverChatModal } from './components/modals/DriverChatModal';
import { ResetStationModal } from './components/modals/ResetStationModal';
import { MobileChargingModal } from './components/modals/MobileChargingModal';
import { SOSHotlineModal } from './components/modals/SOSHotlineModal';
import { ExportShiftModal } from './components/modals/ExportShiftModal';

import {
  Ticket,
  TicketStatus,
  ShiftMetrics,
  OperatorProfile,
  AppNotification,
  emptyShiftMetrics,
  defaultOperatorProfile,
} from './types';
import { ticketApi, metricsApi, operatorApi, notificationApi } from './services/api';
import { seedTicketsData, seedShiftMetrics } from './data/mockTickets';
import { CheckCircle2, AlertCircle, RefreshCw, Sparkles, WifiOff } from 'lucide-react';

export default function App() {
  // Navigation & View
  const [currentTab, setCurrentTab] = useState<NavTab>('tickets');

  // Main Data States (Initialized clean for backend connection)
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<ShiftMetrics>(emptyShiftMetrics);
  const [operatorProfile, setOperatorProfile] = useState<OperatorProfile>(defaultOperatorProfile);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Connection & Loading States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [currentStatusTab, setCurrentStatusTab] = useState<TicketStatus>('all');

  // Modals
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [callModal, setCallModal] = useState<{ isOpen: boolean; name: string; phone: string }>({
    isOpen: false,
    name: '',
    phone: '',
  });
  const [chatModal, setChatModal] = useState<{ isOpen: boolean; name: string }>({
    isOpen: false,
    name: '',
  });
  const [resetStationModal, setResetStationModal] = useState<{ isOpen: boolean; stationId: string }>({
    isOpen: false,
    stationId: '',
  });
  const [isMobileChargingOpen, setIsMobileChargingOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isExportShiftOpen, setIsExportShiftOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3500);
  };

  // Load live data from Backend API
  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setBackendStatus('connecting');

    try {
      const [ticketsResult, metricsResult, profileResult, notificationsResult] = await Promise.allSettled([
        ticketApi.getTickets(),
        metricsApi.getShiftMetrics(),
        operatorApi.getProfile(),
        notificationApi.getNotifications(),
      ]);

      let hasSuccess = false;

      if (ticketsResult.status === 'fulfilled') {
        setTickets(ticketsResult.value);
        if (ticketsResult.value.length > 0) {
          setSelectedTicketId(ticketsResult.value[0].id);
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

  // Seed demo data helper (for testing UI when backend is offline)
  const handleLoadDemoData = () => {
    setTickets(seedTicketsData);
    setMetrics(seedShiftMetrics);
    setSelectedTicketId(seedTicketsData[0].id);
    setIsDemoMode(true);
    showToast('Đã nạp bộ dữ liệu mẫu Demo để kiểm thử giao diện!');
  };

  // Clear demo data helper
  const handleClearData = () => {
    setTickets([]);
    setMetrics(emptyShiftMetrics);
    setSelectedTicketId(null);
    setIsDemoMode(false);
    showToast('Đã dọn sạch dữ liệu về trạng thái khởi tạo.');
  };

  // Live countdown timer for ticket SLA
  useEffect(() => {
    const timer = setInterval(() => {
      setTickets((prevTickets) =>
        prevTickets.map((t) => ({
          ...t,
          slaRemainingSeconds: t.slaRemainingSeconds - 1,
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Filtered Tickets
  const filteredTickets = tickets.filter((t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchPlate = t.vehicle.plate.toLowerCase().includes(q);
      const matchDriver = t.driver.name.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      if (!matchId && !matchPlate && !matchDriver && !matchTitle) return false;
    }

    if (selectedVehicle !== 'all') {
      if (!t.vehicle.model.includes(selectedVehicle)) return false;
    }

    if (selectedPriority !== 'all') {
      if (t.priority !== selectedPriority) return false;
    }

    if (currentStatusTab !== 'all') {
      if (t.status !== currentStatusTab) return false;
    }

    return true;
  });

  // Selected Ticket object
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || (tickets.length > 0 ? tickets[0] : null);

  const handleUpdateTicket = async (updated: Ticket) => {
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    try {
      await ticketApi.updateTicket(updated.id, updated);
    } catch {
      // Local state retained
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? {
              ...t,
              status: 'hoan_tat',
              statusLabel: 'Hoàn tất & Đã đóng',
            }
          : t
      )
    );

    setMetrics((prev) => ({
      ...prev,
      closedTickets: prev.closedTickets + 1,
      inProgressTickets: Math.max(0, prev.inProgressTickets - 1),
      shiftProcessed: prev.shiftProcessed + 1,
      shiftBacklog: Math.max(0, prev.shiftBacklog - 1),
    }));

    showToast(`Đã đóng Ticket #${ticketId} và gửi báo cáo kết thúc ca!`);

    try {
      await ticketApi.closeTicket(ticketId);
    } catch {
      // Handled gracefully
    }
  };

  const handleCreateTicketSubmit = async (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setMetrics((prev) => ({
      ...prev,
      totalTickets: prev.totalTickets + 1,
      inProgressTickets: prev.inProgressTickets + 1,
      emergencyP1Count: newTicket.priority === 'P1' ? prev.emergencyP1Count + 1 : prev.emergencyP1Count,
    }));
    showToast(`Đã khởi tạo thành công Ticket #${newTicket.id}!`);

    try {
      await ticketApi.createTicket(newTicket);
    } catch {
      // Handled gracefully
    }
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

      {/* Backend Status Notification Strip */}
      {backendStatus === 'disconnected' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-between text-xs text-amber-800 z-40">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span>
              <strong>Máy chủ Backend (/api):</strong> Chưa phát hiện dịch vụ Backend đang chạy. Giao diện đang ở chế độ độc lập sẵn sàng kết nối.
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isDemoMode ? (
              <button
                onClick={handleLoadDemoData}
                className="px-2.5 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              >
                <Sparkles className="w-3 h-3" />
                Nạp dữ liệu mẫu Demo
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

      {/* Top Header matching GSM Brand */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenNotifications={() => {}}
        operatorProfile={operatorProfile}
        notifications={notifications}
        onUpdateOperatorStatus={(status) => {
          setOperatorProfile((prev) => ({ ...prev, status }));
          showToast(`Đã chuyển trạng thái: ${status === 'online' ? 'Sẵn sàng' : status === 'break' ? 'Giải lao' : 'Bận'}`);
          operatorApi.updateStatus(status).catch(() => {});
        }}
      />

      {/* Main Container: Sidebar + Working View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          ticketCount={tickets.length}
          chatCount={0}
          metrics={metrics}
        />

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden p-3.5 bg-[#f8f9ff]">
          {currentTab === 'tickets' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* 4 Metric Cards */}
              <KPICards
                metrics={metrics}
                onFilterEmergency={() => {
                  setSelectedPriority('P1');
                  showToast('Đã lọc sự cố khẩn cấp P1');
                }}
              />

              {/* Filter Toolbar & Status Tabs */}
              <FilterToolbar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedVehicle={selectedVehicle}
                onVehicleChange={setSelectedVehicle}
                selectedPriority={selectedPriority}
                onPriorityChange={setSelectedPriority}
                currentStatusTab={currentStatusTab}
                onStatusTabChange={setCurrentStatusTab}
                onOpenCreateTicket={() => setIsCreateTicketOpen(true)}
                onExportShift={() => setIsExportShiftOpen(true)}
                onManualRefresh={() => {
                  loadInitialData();
                  showToast('Đang làm mới dữ liệu từ hệ thống GSM API...');
                }}
              />

              {/* 2-Column Split: Ticket Queue (Left) & Ticket Detail Workspace (Right) */}
              <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden min-h-0">
                {/* Left: Queue of tickets */}
                <TicketQueue
                  tickets={filteredTickets}
                  selectedTicketId={selectedTicket?.id || ''}
                  onSelectTicket={(t) => setSelectedTicketId(t.id)}
                  isLoading={isLoading}
                />

                {/* Right: Rich detail workspace */}
                {selectedTicket ? (
                  <TicketDetail
                    ticket={selectedTicket}
                    onUpdateTicket={handleUpdateTicket}
                    onCallDriver={(name, phone) => setCallModal({ isOpen: true, name, phone })}
                    onChatDriver={(name) => setChatModal({ isOpen: true, name })}
                    onResetStation={(stationId) => setResetStationModal({ isOpen: true, stationId })}
                    onOpenMobileCharging={() => setIsMobileChargingOpen(true)}
                    onCloseTicket={handleCloseTicket}
                  />
                ) : (
                  <div className="flex-1 bg-white border border-slate-200/90 rounded-xl flex flex-col items-center justify-center p-8 text-center shadow-2xs">
                    <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <CheckCircle2 className="w-7 h-7 text-[#20B9BE]" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">Chưa có ticket nào được chọn</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      {tickets.length === 0
                        ? 'Chưa có ticket sự cố nào trong hàng đợi của ca trực. Các sự cố từ tài xế hoặc hệ thống Telematics sẽ xuất hiện tự động tại đây.'
                        : 'Vui lòng bấm chọn một ticket trong hàng đợi bên trái để xem chi tiết thông số viễn thông xe và thao tác điều phối.'}
                    </p>
                    {tickets.length === 0 && !isDemoMode && (
                      <button
                        onClick={handleLoadDemoData}
                        className="mt-4 px-3.5 py-1.5 bg-[#008284] hover:bg-[#006f71] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Xem trước với dữ liệu mẫu Demo
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Secondary Views */}
          {currentTab === 'driver_chat' && (
            <DriverChatInboxView
              onCallDriver={(name, phone) => setCallModal({ isOpen: true, name, phone })}
            />
          )}

          {currentTab === 'fleet_map' && <FleetMapView />}

          {currentTab === 'driver_management' && (
            <DriverDirectoryView
              onCallDriver={(name, phone) => setCallModal({ isOpen: true, name, phone })}
              onChatDriver={(name) => setChatModal({ isOpen: true, name })}
            />
          )}

          {currentTab === 'sla_reports' && (
            <SLAReportView metrics={metrics} tickets={tickets} />
          )}
        </main>
      </div>

      {/* Modals */}
      <CreateTicketModal
        isOpen={isCreateTicketOpen}
        onClose={() => setIsCreateTicketOpen(false)}
        onSubmit={handleCreateTicketSubmit}
      />

      <DriverCallModal
        isOpen={callModal.isOpen}
        onClose={() => setCallModal({ ...callModal, isOpen: false })}
        driverName={callModal.name}
        driverPhone={callModal.phone}
      />

      <DriverChatModal
        isOpen={chatModal.isOpen}
        onClose={() => setChatModal({ ...chatModal, isOpen: false })}
        driverName={chatModal.name}
      />

      <ResetStationModal
        isOpen={resetStationModal.isOpen}
        onClose={() => setResetStationModal({ ...resetStationModal, isOpen: false })}
        stationId={resetStationModal.stationId}
      />

      <MobileChargingModal
        isOpen={isMobileChargingOpen}
        onClose={() => setIsMobileChargingOpen(false)}
      />

      <SOSHotlineModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      <ExportShiftModal
        isOpen={isExportShiftOpen}
        onClose={() => setIsExportShiftOpen(false)}
        metrics={metrics}
        operatorProfile={operatorProfile}
      />
    </div>
  );
}
