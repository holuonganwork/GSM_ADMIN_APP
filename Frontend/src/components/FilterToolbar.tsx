/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fraud Investigation Filter Toolbar
 */

import React, { useState } from 'react';
import {
  Search,
  ShieldAlert,
  AlertTriangle,
  Download,
  Plus,
  RotateCw,
  ChevronDown,
  FileCheck2,
  CheckCircle2,
  Gavel
} from 'lucide-react';
import { CaseStatus, FraudType, CaseSeverity } from '../types';

interface FilterToolbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedFraudType: string;
  onFraudTypeChange: (type: string) => void;
  selectedSeverity: string;
  onSeverityChange: (sev: string) => void;
  currentStatusTab: CaseStatus;
  onStatusTabChange: (status: CaseStatus) => void;
  onOpenCreateCase?: () => void;
  onExportReport?: () => void;
  onManualRefresh: () => void;
  pendingCount?: number;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedFraudType,
  onFraudTypeChange,
  selectedSeverity,
  onSeverityChange,
  currentStatusTab,
  onStatusTabChange,
  onExportReport,
  onManualRefresh,
  pendingCount = 0,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    onManualRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const statusTabs = [
    { id: 'all' as CaseStatus, label: 'Tất cả vụ vi phạm' },
    {
      id: 'da_nop_cho_duyet' as CaseStatus,
      label: 'Đã có giải trình (Chờ duyệt)',
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: 'bg-amber-500 text-white font-bold'
    },
    { id: 'cho_tai_xe_giai_trinh' as CaseStatus, label: 'Chờ tài xế giải trình' },
    { id: 'da_tha_loi' as CaseStatus, label: 'Đã tha lỗi / Minh oan' },
    { id: 'da_xu_phat' as CaseStatus, label: 'Đã xử phạt vi phạm' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-3 mb-3 shadow-2xs space-y-3">
      {/* Top row: Search input & Action dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Quick search input: Case ID, Driver Name, CCCD, Plate */}
          <div className="relative w-64 sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="filter-case-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm mã hồ sơ, CCCD, tên tài xế..."
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-[#20B9BE] rounded-xl text-sm font-medium text-slate-800 focus:outline-none transition-all"
            />
          </div>

          {/* Fraud Type Dropdown */}
          <div className="relative">
            <select
              id="filter-fraud-type-select"
              value={selectedFraudType}
              onChange={(e) => onFraudTypeChange(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả loại vi phạm gian lận</option>
              <option value="cuoc_ao">Cuốc ảo / Chạy khống (Bonus hunting)</option>
              <option value="gps_spoofing">Giả lập vị trí GPS (Mock Location)</option>
              <option value="gian_lan_voucher">Trục lợi mã giảm giá Voucher</option>
              <option value="thu_cuoc_sai">Thu cước sai / Thu ngoài app</option>
              <option value="tat_dinh_vi">Ngắt kết nối T-Box Telematics</option>
            </select>
            <ShieldAlert className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Severity Dropdown */}
          <div className="relative">
            <select
              id="filter-severity-select"
              value={selectedSeverity}
              onChange={(e) => onSeverityChange(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Tất cả mức độ nghiêm trọng</option>
              <option value="nghiem_trong">Nghiêm trọng (Cần đình chỉ)</option>
              <option value="trung_binh">Trung bình (Thẩm định biên bản)</option>
              <option value="nhe">Nhẹ (Xem xét nhắc nhở)</option>
            </select>
            <AlertTriangle className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Right buttons: Export Report & Auto Refresh */}
        <div className="flex items-center gap-2">
          {onExportReport && (
            <button
              id="btn-export-report"
              onClick={onExportReport}
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-sm font-semibold transition-colors shadow-2xs active:scale-98 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Xuất biên bản</span>
            </button>
          )}

          {/* Manual Refresh button */}
          <button
            id="btn-manual-refresh"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-60"
            title="Làm mới dữ liệu"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#008284]' : 'text-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* Bottom row: Status Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pt-1.5 border-t border-slate-100 no-scrollbar">
        {statusTabs.map((tab) => {
          const isActive = currentStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onStatusTabChange(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${isActive
                  ? 'btn-gsm-primary'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${tab.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
