/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fraud Case & Appeals Queue
 */

import React, { useState } from 'react';
import { FraudCase, CaseStatus } from '../types';
import { 
  AlertTriangle, 
  ArrowUpDown, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  IdCard, 
  Car,
  Download,
  RotateCw,
  X,
  SlidersHorizontal
} from 'lucide-react';

interface TicketQueueProps {
  tickets: FraudCase[];
  selectedTicketId: string;
  onSelectTicket: (ticket: FraudCase) => void;
  isLoading?: boolean;
  currentStatusTab?: CaseStatus;
  onStatusTabChange?: (status: CaseStatus) => void;
  pendingCount?: number;
  selectedFraudType?: string;
  onFraudTypeChange?: (type: string) => void;
  selectedSeverity?: string;
  onSeverityChange?: (sev: string) => void;
  onResetFilters?: () => void;
  onExportReport?: () => void;
  onManualRefresh?: () => void;
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

export const TicketQueue: React.FC<TicketQueueProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  isLoading = false,
  currentStatusTab = 'all',
  onStatusTabChange,
  pendingCount = 0,
  selectedFraudType = 'all',
  onFraudTypeChange,
  selectedSeverity = 'all',
  onSeverityChange,
  onResetFilters,
  onExportReport,
  onManualRefresh,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    if (onManualRefresh) {
      setIsRefreshing(true);
      onManualRefresh();
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const hasActiveFilters = selectedFraudType !== 'all' || selectedSeverity !== 'all';

  const statusTabs = [
    { id: 'all' as CaseStatus, label: 'Tất cả' },
    {
      id: 'da_nop_cho_duyet' as CaseStatus,
      label: 'Chờ duyệt',
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeColor: 'bg-amber-500 text-white font-bold'
    },
    { id: 'da_tha_loi' as CaseStatus, label: 'Đã tha lỗi' },
    { id: 'da_xu_phat' as CaseStatus, label: 'Đã xử phạt' },
  ];

  const getFraudBadge = (type: string) => {
    switch (type) {
      case 'cuoc_ao':
        return 'bg-rose-600 text-white';
      case 'gps_spoofing':
        return 'bg-purple-600 text-white';
      case 'gian_lan_voucher':
        return 'bg-amber-600 text-white';
      case 'thu_cuoc_sai':
        return 'bg-blue-600 text-white';
      case 'tat_dinh_vi':
        return 'bg-slate-700 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'da_nop_cho_duyet':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'cho_tai_xe_giai_trinh':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'yeu_cau_bo_sung':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'da_tha_loi':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'da_xu_phat':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="w-full lg:w-[420px] xl:w-[440px] shrink-0 flex flex-col h-full bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
      {/* Header bar with Title, Actions & Status Tabs */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/70 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              HỒ SƠ GIAN LẬN & GIẢI TRÌNH
            </h3>
            <span className="px-2 py-0.5 bg-slate-200/80 text-slate-700 rounded-full text-[11px] font-bold">
              {tickets.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {onExportReport && (
              <button
                id="btn-export-report"
                data-testid="btn-export-report"
                onClick={onExportReport}
                className="flex items-center gap-1 px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                title="Xuất biên bản ca trực"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Xuất</span>
              </button>
            )}
            {onManualRefresh && (
              <button
                id="btn-manual-refresh"
                data-testid="btn-manual-refresh"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="w-7.5 h-7.5 flex items-center justify-center bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-all cursor-pointer shadow-2xs disabled:opacity-60"
                title="Làm mới danh sách"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#008284]' : 'text-slate-500'}`} />
              </button>
            )}
          </div>
        </div>

        {/* Status Category Segmented Tabs */}
        {onStatusTabChange && (
          <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/70 rounded-xl">
            {statusTabs.map((tab) => {
              const isActive = currentStatusTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`filter-tab-${tab.id}`}
                  data-testid={`filter-tab-${tab.id}`}
                  onClick={() => onStatusTabChange(tab.id)}
                  className={`flex items-center justify-center gap-1 py-1.5 px-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#006768] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                  }`}
                >
                  <span className="truncate">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${tab.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Filter Chips (if any filter from Header is active) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] border-t border-slate-200/60">
            <span className="text-slate-400 font-medium">Đang lọc:</span>
            {selectedFraudType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200/70 text-rose-800 font-medium">
                <span className="truncate max-w-[120px]">{fraudTypeLabels[selectedFraudType] || selectedFraudType}</span>
                <button
                  type="button"
                  onClick={() => onFraudTypeChange?.('all')}
                  className="hover:bg-rose-200/60 rounded p-0.5 cursor-pointer text-rose-600"
                  title="Gỡ bộ lọc này"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {selectedSeverity !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/70 text-amber-800 font-medium">
                <span>{severityLabels[selectedSeverity] || selectedSeverity}</span>
                <button
                  type="button"
                  onClick={() => onSeverityChange?.('all')}
                  className="hover:bg-amber-200/60 rounded p-0.5 cursor-pointer text-amber-600"
                  title="Gỡ bộ lọc này"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
            {onResetFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="text-slate-400 hover:text-rose-600 underline cursor-pointer text-[10px] ml-auto"
              >
                Xóa lọc
              </button>
            )}
          </div>
        )}
      </div>

      {/* Case List Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isLoading ? (
          <div className="space-y-3 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200/60 bg-slate-50/50 animate-pulse space-y-2.5">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                  <div className="h-3 w-20 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-3 w-3/4 bg-slate-100 rounded"></div>
              </div>
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">Không có hồ sơ tồn đọng</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Tất cả các biên bản vi phạm và giải trình đã được xem xét và ra quyết định.
            </p>
          </div>
        ) : (
          tickets.map((caseItem) => {
            const isSelected = caseItem.id === selectedTicketId;

            return (
              <div
                key={caseItem.id}
                id={`case-card-${caseItem.id}`}
                data-testid={`case-card-${caseItem.id}`}
                onClick={() => onSelectTicket(caseItem)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#E3F8F8]/40 border-[#20B9BE] shadow-xs ring-1 ring-[#20B9BE]/30'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Active Indicator bar on left */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#20B9BE] rounded-r-md"></div>
                )}

                {/* Top row: ID, Fraud Type Badge, Time */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-extrabold text-slate-900 tracking-tight font-mono whitespace-nowrap shrink-0">
                      #{caseItem.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold shadow-2xs whitespace-nowrap truncate ${getFraudBadge(caseItem.fraudType)}`}>
                      {caseItem.fraudTypeLabel}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0">
                    {caseItem.timeAgo}
                  </span>
                </div>

                {/* Driver Name & CCCD - Explicitly NO team info */}
                <div className="bg-slate-50/90 rounded-xl p-2.5 mb-2.5 border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900">
                      {caseItem.driver.name}
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      caseItem.driver.trustScore < 50 
                        ? 'bg-rose-100 text-rose-700' 
                        : caseItem.driver.trustScore < 75 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      Tín nhiệm: {caseItem.driver.trustScore}/100
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600 font-mono">
                    <span className="flex items-center gap-1.5">
                      <IdCard className="w-3.5 h-3.5 text-slate-400" />
                      CCCD: <strong className="text-slate-900">{caseItem.driver.cccd}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    <span>{caseItem.driver.vehicleModel}</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-slate-700">{caseItem.driver.plate}</span>
                  </div>
                </div>

                {/* Anomaly snippet */}
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-2.5">
                  {caseItem.evidence.anomalyTitle}
                </p>

                {/* Bottom status badge */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(caseItem.status)}`}>
                    {caseItem.statusLabel}
                  </span>
                  {caseItem.explanation && (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Có giải trình
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
