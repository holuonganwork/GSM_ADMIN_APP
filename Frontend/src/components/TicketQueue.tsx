/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Ticket } from '../types';
import { Clock, AlertTriangle, ArrowUpDown, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface TicketQueueProps {
  tickets: Ticket[];
  selectedTicketId: string;
  onSelectTicket: (ticket: Ticket) => void;
  isLoading?: boolean;
}

export const TicketQueue: React.FC<TicketQueueProps> = ({
  tickets,
  selectedTicketId,
  onSelectTicket,
  isLoading = false,
}) => {
  // Format seconds into MM:SS or -MM:SS
  const formatSla = (seconds: number) => {
    const isNegative = seconds < 0;
    const absSeconds = Math.abs(seconds);
    const mins = Math.floor(absSeconds / 60);
    const secs = absSeconds % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return {
      isNegative,
      text: isNegative ? `Quá hạn SLA (-${formatted})` : `Còn ${formatted}`,
    };
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'P1':
        return 'bg-rose-500 text-white font-bold';
      case 'P2':
        return 'bg-amber-500 text-white font-bold';
      case 'P3':
        return 'bg-sky-500 text-white font-medium';
      default:
        return 'bg-slate-400 text-white font-medium';
    }
  };

  const getStatusBadge = (statusLabel: string) => {
    if (statusLabel.includes('Đang xử lý') || statusLabel.includes('Đang liên hệ')) {
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    }
    if (statusLabel.includes('Chờ tiếp nhận')) {
      return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
    if (statusLabel.includes('Chờ phản hồi')) {
      return 'bg-[#20B9BE]/10 text-[#006768] border border-[#20B9BE]/30';
    }
    if (statusLabel.includes('IT')) {
      return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    }
    return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  };

  return (
    <div className="w-full lg:w-[410px] xl:w-[430px] shrink-0 flex flex-col h-full bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden">
      {/* Header bar */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div>
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            HÀNG CHỜ CẦN XỬ LÝ ({tickets.length})
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Ưu tiên tự động bằng thuật toán GSM Dispatch SLA
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium cursor-pointer hover:text-slate-800">
          <ArrowUpDown className="w-3 h-3 text-slate-400" />
          <span>Sắp xếp: <strong>SLA giảm dần</strong></span>
        </div>
      </div>

      {/* Ticket List Cards matching Image 4 */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 divide-y divide-slate-100/50">
        {isLoading ? (
          <div className="space-y-3 p-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-200/60 bg-slate-50/50 animate-pulse space-y-2">
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
              <CheckCircle2 className="w-6 h-6 text-[#20B9BE]" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Không có ticket nào trong hàng đợi</h4>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[260px] mx-auto leading-relaxed">
              Tất cả sự cố đã được điều phối xử lý xong hoặc không tìm thấy dữ liệu phù hợp với bộ lọc.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => {
            const isSelected = ticket.id === selectedTicketId;
            const sla = formatSla(ticket.slaRemainingSeconds);

            return (
              <div
                key={ticket.id}
                id={`ticket-card-${ticket.id}`}
                onClick={() => onSelectTicket(ticket)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-[#E3F8F8]/40 border-[#20B9BE] shadow-xs ring-1 ring-[#20B9BE]/30'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Active Indicator bar on left */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-[#20B9BE] rounded-r-md"></div>
                )}

                {/* Top row: ID, Priority, Time ago, SLA */}
                <div className="flex items-center justify-between gap-1.5 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                      #{ticket.id}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priorityLabel}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {ticket.timeAgo}
                    </span>
                  </div>

                  {/* SLA countdown badge */}
                  <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    sla.isNegative
                      ? 'bg-rose-100 text-rose-700 font-bold animate-pulse'
                      : ticket.priority === 'P1'
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {sla.isNegative ? (
                      <AlertTriangle className="w-3 h-3 text-rose-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-slate-500" />
                    )}
                    <span>{sla.text}</span>
                  </div>
                </div>

                {/* Title */}
                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
                  {ticket.title}
                </h4>

                {/* Description */}
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-2.5">
                  {ticket.description}
                </p>

                {/* Bottom Row: Driver & Vehicle Info */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100/90 text-xs">
                  <div className="flex items-center gap-2">
                    {/* Driver Avatar / Initials */}
                    <div className="w-6 h-6 rounded-full bg-[#BCE8E8] text-[#006768] font-bold text-[10px] flex items-center justify-center shrink-0">
                      {ticket.driver.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-800 leading-none">
                        {ticket.driver.name}
                      </span>
                      <span className="text-[10px] text-slate-500 leading-none mt-0.5">
                        {ticket.driver.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* License Plate */}
                    <span className="px-1.5 py-0.5 bg-slate-100 font-mono text-[10px] font-bold text-slate-700 rounded border border-slate-200">
                      {ticket.vehicle.plate}
                    </span>

                    {/* Status Pill */}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap ${getStatusBadge(ticket.statusLabel)}`}>
                      {ticket.statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
