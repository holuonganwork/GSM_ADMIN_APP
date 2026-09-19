/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fraud Case & Appeals Queue
 */

import React from 'react';
import { FraudCase } from '../types';
import { AlertTriangle, ArrowUpDown, CheckCircle2, ShieldAlert, Clock, IdCard, Car } from 'lucide-react';

interface TicketQueueProps {
  tickets: FraudCase[];
  selectedTicketId: string;
  onSelectTicket: (ticket: FraudCase) => void;
  isLoading?: boolean;
}

export const TicketQueue: React.FC<TicketQueueProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  isLoading = false,
}) => {
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
    <div className="w-full lg:w-[410px] xl:w-[430px] shrink-0 flex flex-col h-full bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            HỒ SƠ GIAN LẬN & GIẢI TRÌNH ({tickets.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ưu tiên xem xét biên bản giải trình tài xế vừa gửi lên
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sắp xếp: <strong>Gần nhất</strong></span>
        </div>
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
