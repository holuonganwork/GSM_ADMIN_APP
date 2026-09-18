/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Car, 
  AlertCircle, 
  Download, 
  Plus, 
  RotateCw, 
  ChevronDown 
} from 'lucide-react';
import { TicketStatus, TicketPriority } from '../types';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedVehicle: string;
  onVehicleChange: (v: string) => void;
  selectedPriority: string;
  onPriorityChange: (p: string) => void;
  currentStatusTab: TicketStatus;
  onStatusTabChange: (status: TicketStatus) => void;
  onOpenCreateTicket: () => void;
  onExportShift: () => void;
  onManualRefresh: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedVehicle,
  onVehicleChange,
  selectedPriority,
  onPriorityChange,
  currentStatusTab,
  onStatusTabChange,
  onOpenCreateTicket,
  onExportShift,
  onManualRefresh,
}) => {
  const [autoRefreshSeconds, setAutoRefreshSeconds] = useState(15);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 15-second countdown timer simulating live refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setAutoRefreshSeconds((prev) => {
        if (prev <= 1) {
          setIsRefreshing(true);
          setTimeout(() => setIsRefreshing(false), 800);
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setAutoRefreshSeconds(15);
    onManualRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const statusTabs = [
    { id: 'all' as TicketStatus, label: 'Tất cả (42)' },
    { id: 'cho_tiep_nhan' as TicketStatus, label: 'Chờ tiếp nhận', badge: 12, badgeColor: 'bg-rose-500 text-white' },
    { id: 'dang_xu_ly' as TicketStatus, label: 'Đang xử lý', badge: 18, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'cho_tai_xe' as TicketStatus, label: 'Chờ tài xế phản hồi (7)' },
    { id: 'cho_quan_ly' as TicketStatus, label: 'Cần duyệt cấp quản lý (5)' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3 mb-3 shadow-2xs space-y-3">
      {/* Top row: Search input & Action dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Quick ticket search input */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="filter-ticket-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="TK-8842, biển số..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#20B9BE] rounded-lg text-xs font-medium text-slate-800 focus:outline-none transition-all"
            />
          </div>

          {/* Vehicle Dropdown */}
          <div className="relative">
            <select
              id="filter-vehicle-select"
              value={selectedVehicle}
              onChange={(e) => onVehicleChange(e.target.value)}
              className="appearance-none pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả xe (VF 5, e34, VF 8, Feliz)</option>
              <option value="VF e34">VinFast VF e34</option>
              <option value="VF 5 Plus">VinFast VF 5 Plus</option>
              <option value="VF 8">VinFast VF 8</option>
              <option value="VF 9">VinFast VF 9</option>
              <option value="Feliz S">VinFast Feliz S (GreenBike)</option>
            </select>
            <Car className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <select
              id="filter-priority-select"
              value={selectedPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="appearance-none pl-8 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả mức ưu tiên</option>
              <option value="P1">P1 Khẩn cấp (SLA &lt; 15p)</option>
              <option value="P2">P2 Cao (SLA &lt; 30p)</option>
              <option value="P3">P3 Bình thường (SLA &lt; 60p)</option>
              <option value="P4">P4 Thấp</option>
            </select>
            <AlertCircle className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right buttons: Export & Create Ticket */}
        <div className="flex items-center gap-2">
          <button
            id="btn-export-shift"
            onClick={onExportShift}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-lg text-xs font-semibold transition-colors shadow-2xs active:scale-98"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Xuất ca</span>
          </button>

          <button
            id="btn-create-ticket"
            onClick={onOpenCreateTicket}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#008284] hover:bg-[#006f71] text-white rounded-lg text-xs font-bold transition-all shadow-xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Tạo Ticket mới</span>
          </button>
        </div>
      </div>

      {/* Bottom row: Filter Tabs & Auto-refresh status */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {statusTabs.map((tab) => {
            const isActive = currentStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-status-${tab.id}`}
                onClick={() => onStatusTabChange(tab.id)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#20B9BE]/15 text-[#006768] font-bold shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${tab.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Auto Refresh Status with countdown */}
        <button
          onClick={handleManualRefresh}
          className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 font-medium transition-colors ml-auto cursor-pointer"
          title="Bấm để làm mới ngay"
        >
          <RotateCw className={`w-3 h-3 text-[#20B9BE] ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Tự động làm mới mỗi {autoRefreshSeconds}s</span>
        </button>
      </div>
    </div>
  );
};
