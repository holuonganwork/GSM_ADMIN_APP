/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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

import { mockTicketsData, initialShiftMetrics } from './data/mockTickets';
import { Ticket, TicketStatus, ShiftMetrics } from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation & View
  const [currentTab, setCurrentTab] = useState<NavTab>('tickets');

  // Main Data States
  const [tickets, setTickets] = useState<Ticket[]>(mockTicketsData);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('TK-8842');
  const [metrics, setMetrics] = useState<ShiftMetrics>(initialShiftMetrics);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [currentStatusTab, setCurrentStatusTab] = useState<TicketStatus>('all');

  // Modals
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [callModal, setCallModal] = useState<{ isOpen: boolean; name: string; phone: string }>({
    isOpen: false,
    name: 'Lê Hoàng Long',
    phone: '0912.345.678',
  });
  const [chatModal, setChatModal] = useState<{ isOpen: boolean; name: string }>({
    isOpen: false,
    name: 'Lê Hoàng Long',
  });
  const [resetStationModal, setResetStationModal] = useState<{ isOpen: boolean; stationId: string }>({
    isOpen: false,
    stationId: 'VG-HN-0482',
  });
  const [isMobileChargingOpen, setIsMobileChargingOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isExportShiftOpen, setIsExportShiftOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setGlobalToast(msg);
    setTimeout(() => setGlobalToast(null), 3000);
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
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = t.id.toLowerCase().includes(q);
      const matchPlate = t.vehicle.plate.toLowerCase().includes(q);
      const matchDriver = t.driver.name.toLowerCase().includes(q);
      const matchTitle = t.title.toLowerCase().includes(q);
      if (!matchId && !matchPlate && !matchDriver && !matchTitle) return false;
    }

    // Vehicle model
    if (selectedVehicle !== 'all') {
      if (!t.vehicle.model.includes(selectedVehicle)) return false;
    }

    // Priority
    if (selectedPriority !== 'all') {
      if (t.priority !== selectedPriority) return false;
    }

    // Status tab
    if (currentStatusTab !== 'all') {
      if (t.status !== currentStatusTab) return false;
    }

    return true;
  });

  // Selected Ticket object
  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleUpdateTicket = (updated: Ticket) => {
    setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleCloseTicket = (ticketId: string) => {
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
  };

  const handleCreateTicketSubmit = (newTicket: Ticket) => {
    setTickets([newTicket, ...tickets]);
    setSelectedTicketId(newTicket.id);
    setMetrics((prev) => ({
      ...prev,
      totalTickets: prev.totalTickets + 1,
      inProgressTickets: prev.inProgressTickets + 1,
      emergencyP1Count: newTicket.priority === 'P1' ? prev.emergencyP1Count + 1 : prev.emergencyP1Count,
    }));
    showToast(`Đã khởi tạo thành công Ticket #${newTicket.id}!`);
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

      {/* Top Header matching Image 4 */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenNotifications={() => {}}
      />

      {/* Main Container: Sidebar + Working View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          ticketCount={tickets.length}
          chatCount={7}
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
                  showToast('Dữ liệu đã được làm mới từ hệ thống GSM Cloud.');
                }}
              />

              {/* 2-Column Split: Ticket Queue (Left) & Ticket Detail Workspace (Right) */}
              <div className="flex-1 flex flex-col lg:flex-row gap-3 overflow-hidden min-h-0">
                {/* Left: Queue of 5 highest priority tickets */}
                <TicketQueue
                  tickets={filteredTickets}
                  selectedTicketId={selectedTicket?.id || ''}
                  onSelectTicket={(t) => setSelectedTicketId(t.id)}
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
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs">
                    Vui lòng chọn một ticket để xem chi tiết và thao tác điều phối.
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

          {currentTab === 'sla_reports' && <SLAReportView metrics={metrics} />}
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
      />
    </div>
  );
}
