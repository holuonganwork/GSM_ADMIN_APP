/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Star 
} from 'lucide-react';
import { ShiftMetrics } from '../types';

interface KPICardsProps {
  metrics: ShiftMetrics;
  onFilterEmergency?: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({ metrics, onFilterEmergency }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5 mb-3">
      {/* Card 1: TỔNG TICKET TRONG CA */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            TỔNG TICKET TRONG CA
          </span>
          <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-slate-500">
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {metrics.totalTickets}
          </span>
          <span className="flex items-center text-[11px] font-bold text-emerald-600">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            +{metrics.trendPercentage}%
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Đã đóng: <strong className="text-slate-800 font-semibold">{metrics.closedTickets}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Đang xử lý: <strong className="text-slate-800 font-semibold">{metrics.inProgressTickets}</strong></span>
          <span className="text-slate-300">•</span>
          <span>Khẩn cấp: <strong className="text-rose-600 font-bold">{metrics.emergencyTickets}</strong></span>
        </div>
      </div>

      {/* Card 2: SỰ CỐ KHẨN CẤP P1 */}
      <div 
        onClick={onFilterEmergency}
        className="bg-white border border-rose-200/80 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group hover:border-rose-300"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            SỰ CỐ KHẨN CẤP P1
          </span>
          <div className="w-6 h-6 rounded-md bg-rose-50 flex items-center justify-center text-rose-500">
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className={`text-2xl font-black tracking-tight ${metrics.emergencyP1Count > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {metrics.emergencyP1Count < 10 ? `0${metrics.emergencyP1Count}` : metrics.emergencyP1Count}
          </span>
          {metrics.emergencyP1Count > 0 ? (
            <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full shadow-2xs group-hover:bg-rose-700 transition-colors">
              Can thiệp ngay
            </span>
          ) : (
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded-full">
              Kiểm soát tốt
            </span>
          )}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center text-[11px] text-slate-600 font-medium overflow-hidden text-ellipsis whitespace-nowrap">
          {metrics.emergencySubText && metrics.emergencySubText.length > 0 ? (
            metrics.emergencySubText.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-300 mx-1.5">•</span>}
                <span>{item}</span>
              </React.Fragment>
            ))
          ) : (
            <span className="text-slate-400">Không có sự cố khẩn cấp tồn đọng</span>
          )}
        </div>
      </div>

      {/* Card 3: THỜI GIAN SLA TRUNG BÌNH */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            THỜI GIAN SLA TRUNG BÌNH
          </span>
          <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {metrics.avgSlaMinutes}
            </span>
            <span className="text-xs font-semibold text-slate-500">phút</span>
          </div>
          <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-md">
            Chuẩn SLA &lt; {metrics.slaTargetMinutes}m
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Tốc độ phản hồi ca:</span>
          <span className="font-semibold text-emerald-600">
            Nhanh hơn {metrics.responseSpeedFasterPercent}%
          </span>
        </div>
      </div>

      {/* Card 4: TỶ LỆ GIẢI QUYẾT FCR */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            TỶ LỆ GIẢI QUYẾT FCR
          </span>
          <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            {metrics.fcrRatePercent}%
          </span>
          <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold rounded-md">
            Vượt mục tiêu {metrics.fcrTargetPercent}%
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Đánh giá tài xế:</span>
          <span className="font-bold text-slate-800 flex items-center gap-1">
            {metrics.driverRating} / 5.0
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
          </span>
        </div>
      </div>
    </div>
  );
};
