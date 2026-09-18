/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ShieldAlert, 
  FileCheck2, 
  CheckCircle2, 
  Gavel, 
  TrendingUp, 
  Coins 
} from 'lucide-react';
import { ComplianceMetrics } from '../types';

interface KPICardsProps {
  metrics: ComplianceMetrics;
  onFilterPending?: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, onFilterPending }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-3">
      {/* Card 1: TỔNG VỤ GIAN LẬN GHI NHẬN */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            TỔNG VỤ GHI NHẬN
          </span>
          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-600">
            <ShieldAlert className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {metrics.totalCases}
          </span>
          <span className="text-xs text-slate-400 font-medium">hồ sơ trong ca</span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Chờ duyệt: <strong className="text-amber-600 font-bold">{metrics.pendingReview}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Tha lỗi: <strong className="text-emerald-600 font-semibold">{metrics.exoneratedCount}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Xử phạt: <strong className="text-rose-600 font-bold">{metrics.penalizedCount}</strong></span>
        </div>
      </div>

      {/* Card 2: BIÊN BẢN CHỜ THẨM ĐỊNH */}
      <div 
        onClick={onFilterPending}
        className="bg-white border border-amber-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group hover:border-amber-400 bg-linear-to-br from-white to-amber-50/20"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            BIÊN BẢN CHỜ THẨM ĐỊNH
          </span>
          <div className="w-6 h-6 rounded-md bg-amber-100/80 flex items-center justify-center text-amber-700">
            <FileCheck2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-black text-amber-600 tracking-tight">
            {metrics.pendingReview < 10 ? `0${metrics.pendingReview}` : metrics.pendingReview}
          </span>
          <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full shadow-2xs group-hover:bg-amber-600 transition-colors">
            Cần ra phán quyết
          </span>
        </div>

        <div className="pt-2 border-t border-amber-100 flex items-center text-[11px] text-amber-800 font-medium">
          <span>Tài xế đã gửi lời giải trình & bằng chứng</span>
        </div>
      </div>

      {/* Card 3: ĐÃ THA LỖI / MINH OAN */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            ĐÃ THA LỖI / MINH OAN
          </span>
          <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black text-emerald-600 tracking-tight">
            {metrics.exoneratedCount}
          </span>
          <span className="text-xs text-slate-400 font-medium">hồ sơ hợp lý</span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
          <span>Đã bảo lưu quyền lợi & điểm uy tín</span>
        </div>
      </div>

      {/* Card 4: ĐÃ XỬ PHẠT / TRUY THU */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            ĐÃ XỬ PHẠT & TRUY THU
          </span>
          <div className="w-6 h-6 rounded-md bg-rose-50 flex items-center justify-center text-rose-600">
            <Gavel className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-black text-rose-600 tracking-tight">
            {metrics.totalFinesRecovered > 0 
              ? `${(metrics.totalFinesRecovered / 1000000).toFixed(1)}Tr đ` 
              : '0 đ'}
          </span>
          <span className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold rounded-md">
            {metrics.penalizedCount} quyết định
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Khấu trừ ví & tạm đình chỉ app</span>
        </div>
      </div>
    </div>
  );
};
