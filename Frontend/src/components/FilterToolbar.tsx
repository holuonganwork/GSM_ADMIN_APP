/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fraud Investigation Filter Toolbar
 */

import React, { useState } from 'react';
import {
  Download,
  RotateCw,
  X,
  SlidersHorizontal,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { CaseStatus } from '../types';

interface FilterToolbarProps {
  currentStatusTab: CaseStatus;
  onStatusTabChange: (status: CaseStatus) => void;
  selectedFraudType?: string;
  onFraudTypeChange?: (type: string) => void;
  selectedSeverity?: string;
  onSeverityChange?: (sev: string) => void;
  onResetFilters?: () => void;
  onExportReport?: () => void;
  onManualRefresh: () => void;
  pendingCount?: number;
  // Optional for backward compatibility
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

const fraudTypeLabels: Record<string, string> = {
  cuoc_ao: 'Cuốc ảo / Chạy khống',
  gps_spoofing: 'Giả lập vị trí GPS',
  gian_lan_voucher: 'Trục lợi Voucher',
  thu_cuoc_sai: 'Thu cước sai',
  tat_dinh_vi: 'Ngắt kết nối T-Box',
};

const severityLabels: Record<string, string> = {
  nghiem_trong: 'Nghiêm trọng',
  trung_binh: 'Trung bình',
  nhe: 'Nhẹ',
};

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  currentStatusTab,
  onStatusTabChange,
  selectedFraudType = 'all',
  onFraudTypeChange,
  selectedSeverity = 'all',
  onSeverityChange,
  onResetFilters,
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

  const hasActiveFilters = selectedFraudType !== 'all' || selectedSeverity !== 'all';

  const statusTabs = [
    { id: 'all' as CaseStatus, label: 'Tất cả vụ vi phạm' },
    {
      id: 'da_nop_cho_duyet' as CaseStatus,
      label: 'Đã có giải trình (Chờ duyệt)',
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: 'bg-amber-500 text-white font-bold'
    },
    { id: 'da_tha_loi' as CaseStatus, label: 'Đã tha lỗi / Minh oan' },
    { id: 'da_xu_phat' as CaseStatus, label: 'Đã xử phạt vi phạm' },
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 mb-3 shadow-2xs space-y-2">
      {/* Top row: Status Tabs & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Status Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {statusTabs.map((tab) => {
            const isActive = currentStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`filter-tab-${tab.id}`}
                data-testid={`filter-tab-${tab.id}`}
                onClick={() => onStatusTabChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'btn-gsm-primary shadow-xs'
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

        {/* Right buttons: Export Report & Manual Refresh */}
        <div className="flex items-center gap-2 shrink-0">
          {onExportReport && (
            <button
              id="btn-export-report"
              data-testid="btn-export-report"
              onClick={onExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold transition-colors shadow-2xs active:scale-98 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>Xuất biên bản</span>
            </button>
          )}

          {/* Manual Refresh button */}
          <button
            id="btn-manual-refresh"
            data-testid="btn-manual-refresh"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="w-8.5 h-8.5 flex items-center justify-center bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-all shadow-2xs active:scale-95 cursor-pointer disabled:opacity-60"
            title="Làm mới dữ liệu"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#008284]' : 'text-slate-500'}`} />
          </button>
        </div>
      </div>

      {/* Active Filter Chips (displayed if any header filter is active, webmail style) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#008284]" />
            <span>Bộ lọc đang áp dụng:</span>
          </div>

          {selectedFraudType !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200/70 text-rose-800 font-medium">
              <ShieldAlert className="w-3 h-3 text-rose-600" />
              <span>Loại: {fraudTypeLabels[selectedFraudType] || selectedFraudType}</span>
              <button
                type="button"
                onClick={() => onFraudTypeChange?.('all')}
                className="hover:bg-rose-200/60 rounded-full p-0.5 text-rose-600 cursor-pointer"
                title="Gỡ bộ lọc này"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSeverity !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/70 text-amber-800 font-medium">
              <AlertTriangle className="w-3 h-3 text-amber-600" />
              <span>Mức độ: {severityLabels[selectedSeverity] || selectedSeverity}</span>
              <button
                type="button"
                onClick={() => onSeverityChange?.('all')}
                className="hover:bg-amber-200/60 rounded-full p-0.5 text-amber-600 cursor-pointer"
                title="Gỡ bộ lọc này"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="text-slate-400 hover:text-slate-700 underline text-xs cursor-pointer ml-1"
            >
              Xóa tất cả
            </button>
          )}
        </div>
      )}
    </div>
  );
};
