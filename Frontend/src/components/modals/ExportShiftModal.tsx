/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Download, FileSpreadsheet, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { ComplianceMetrics, OperatorProfile, defaultOperatorProfile } from '../../types';

interface ExportShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ComplianceMetrics;
  operatorProfile?: OperatorProfile;
}

export const ExportShiftModal: React.FC<ExportShiftModalProps> = ({
  isOpen,
  onClose,
  metrics,
  operatorProfile = defaultOperatorProfile,
}) => {
  if (!isOpen) return null;

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Thong So Kiem Soat', 'Gia Tri'],
      ['Ca truc', `${operatorProfile.shift} (${operatorProfile.shiftTime})`],
      ['Chuyen vien tham dinh', `${operatorProfile.name} (${operatorProfile.code})`],
      ['Tong vu gian lan ghi nhan', metrics.totalCases],
      ['Ho so cho tham dinh', metrics.pendingReview],
      ['So vu da tha loi / minh oan', metrics.exoneratedCount],
      ['So vu da xu phat & truy thu', metrics.penalizedCount],
      ['Tong tien phat va truy thu (VND)', metrics.totalFinesRecovered],
      ['Thoi gian tham dinh trung binh (gio)', metrics.avgReviewTimeHours],
      ['Ty le dung han SLA (%)', `${metrics.slaCompliancePercent}%`],
    ]
      .map((e) => e.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_cao_kiem_soat_gian_lan_GSM_${new Date().toISOString().slice(0, 10)}.csv`);
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
              <p className="text-[11px] text-slate-500">{operatorProfile.shift}: {operatorProfile.shiftTime} | {operatorProfile.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-2.5 text-xs text-slate-700">
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <span>Tổng số vụ nghi vấn ghi nhận:</span>
            <strong className="text-slate-900 font-bold">{metrics.totalCases} hồ sơ</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-amber-50/60 rounded-lg border border-amber-200/60">
            <span>Biên bản giải trình chờ thẩm định:</span>
            <strong className="text-amber-700 font-bold">{metrics.pendingReview} hồ sơ</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200/60">
            <span>Đã tha lỗi / minh oan:</span>
            <strong className="text-emerald-700 font-bold">{metrics.exoneratedCount} hồ sơ</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-rose-50/60 rounded-lg border border-rose-200/60">
            <span>Đã xử phạt & truy thu:</span>
            <strong className="text-rose-700 font-bold">{metrics.penalizedCount} hồ sơ</strong>
          </div>
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <span>Tổng tiền phạt & truy thu:</span>
            <strong className="text-emerald-700 font-bold font-mono">
              {metrics.totalFinesRecovered ? `${metrics.totalFinesRecovered.toLocaleString('vi-VN')} đ` : '0 đ'}
            </strong>
          </div>
          <div className="flex justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
            <span>Tỷ lệ xử lý đúng hạn cam kết (SLA):</span>
            <strong className="text-[#008284] font-bold">{metrics.slaCompliancePercent}%</strong>
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
            className="flex items-center gap-1.5 px-4 py-2 btn-gsm-primary rounded-lg text-xs font-bold cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Tải file CSV bàn giao
          </button>
        </div>
      </div>
    </div>
  );
};
