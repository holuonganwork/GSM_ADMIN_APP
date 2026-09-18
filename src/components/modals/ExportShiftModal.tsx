/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Download, FileSpreadsheet, CheckCircle2, Clock } from 'lucide-react';
import { ShiftMetrics } from '../../types';

interface ExportShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ShiftMetrics;
}

export const ExportShiftModal: React.FC<ExportShiftModalProps> = ({
  isOpen,
  onClose,
  metrics,
}) => {
  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Thong So', 'Gia Tri'],
      ['Ca truc', 'Sang 07:00 - 15:00'],
      ['Dieu phoi vien', 'Nguyen Mai Chi (GSM-889)'],
      ['Tong ticket trong ca', metrics.totalTickets],
      ['Da dong', metrics.closedTickets],
      ['Dang xu ly', metrics.inProgressTickets],
      ['Su co khan cap P1', metrics.emergencyP1Count],
      ['SLA trung binh (phut)', metrics.avgSlaMinutes],
      ['Ty le giai quyet FCR (%)', metrics.fcrRatePercent],
      ['Danh gia tai xe', `${metrics.driverRating} / 5.0`],
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_cao_ca_truc_GSM_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col p-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Báo Cáo Bàn Giao Ca Trực GSM</h3>
              <p className="text-[11px] text-slate-500">Ca sáng: 07:00 - 15:00 | Đội 1</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-2.5 text-xs text-slate-700">
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <span>Tổng số sự cố tiếp nhận:</span>
            <strong className="text-slate-900 font-bold">{metrics.totalTickets} tickets</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <span>Đã xử lý dứt điểm:</span>
            <strong className="text-emerald-600 font-bold">{metrics.closedTickets} tickets</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <span>Thời gian phản hồi SLA trung bình:</span>
            <strong className="text-slate-900 font-bold">{metrics.avgSlaMinutes} phút</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <span>Tỷ lệ hài lòng của tài xế:</span>
            <strong className="text-[#008284] font-bold">{metrics.driverRating} / 5.0 ★</strong>
          </div>
        </div>

        <div className="flex gap-2.5 justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            Đóng
          </button>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#008284] hover:bg-[#006f71] text-white text-xs font-bold rounded-lg shadow-xs active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            Tải file CSV bàn giao
          </button>
        </div>
      </div>
    </div>
  );
};
