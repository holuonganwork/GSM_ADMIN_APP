/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock, ShieldAlert, Award } from 'lucide-react';
import { ShiftMetrics, Ticket, SLABreakdownItem } from '../../types';

interface SLAReportViewProps {
  metrics: ShiftMetrics;
  tickets?: Ticket[];
  customBreakdown?: SLABreakdownItem[];
}

export const SLAReportView: React.FC<SLAReportViewProps> = ({
  metrics,
  tickets = [],
  customBreakdown,
}) => {
  // Compute breakdown dynamically from actual tickets if available
  const computedBreakdown: SLABreakdownItem[] = customBreakdown || [
    {
      type: 'P1 Khẩn cấp (SLA < 15 phút)',
      total: tickets.filter((t) => t.priority === 'P1').length,
      passed: tickets.filter((t) => t.priority === 'P1' && t.slaRemainingSeconds >= 0).length,
      failed: tickets.filter((t) => t.priority === 'P1' && t.slaRemainingSeconds < 0).length,
      rate: 0,
    },
    {
      type: 'P2 Mức độ cao (SLA < 30 phút)',
      total: tickets.filter((t) => t.priority === 'P2').length,
      passed: tickets.filter((t) => t.priority === 'P2' && t.slaRemainingSeconds >= 0).length,
      failed: tickets.filter((t) => t.priority === 'P2' && t.slaRemainingSeconds < 0).length,
      rate: 0,
    },
    {
      type: 'P3 Tiêu chuẩn (SLA < 60 phút)',
      total: tickets.filter((t) => t.priority === 'P3').length,
      passed: tickets.filter((t) => t.priority === 'P3' && t.slaRemainingSeconds >= 0).length,
      failed: tickets.filter((t) => t.priority === 'P3' && t.slaRemainingSeconds < 0).length,
      rate: 0,
    },
    {
      type: 'P4 Tư vấn & Hướng dẫn (SLA < 120 phút)',
      total: tickets.filter((t) => t.priority === 'P4').length,
      passed: tickets.filter((t) => t.priority === 'P4' && t.slaRemainingSeconds >= 0).length,
      failed: tickets.filter((t) => t.priority === 'P4' && t.slaRemainingSeconds < 0).length,
      rate: 0,
    },
  ].map((item) => ({
    ...item,
    rate: item.total > 0 ? Math.round((item.passed / item.total) * 1000) / 10 : 100,
  }));

  const slaBreakdown = computedBreakdown;

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#20B9BE]" />
            Báo Cáo Hiệu Suất & Cam Kết SLA Ca Trực (GSM Dispatch SLA Analytics)
          </h2>
          <p className="text-xs text-slate-500">Đo lường thời gian xử lý sự cố, tỷ lệ xử lý dứt điểm FCR và mức độ hài lòng</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            Đạt chỉ tiêu SLA toàn ca: {metrics.shiftSlaPercent}%
          </span>
        </div>
      </div>

      {/* Top 3 Metric summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Thời gian phản hồi bình quân (ART)</div>
          <div className="text-2xl font-black text-slate-900">
            {metrics.avgSlaMinutes > 0 ? `${metrics.avgSlaMinutes} phút` : 'Chưa có phát sinh'}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            {metrics.responseSpeedFasterPercent > 0
              ? `Nhanh hơn ${metrics.responseSpeedFasterPercent}% so với định mức ${metrics.slaTargetMinutes} phút`
              : `Định mức cam kết: < ${metrics.slaTargetMinutes} phút`}
          </p>
        </div>
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Tỷ lệ giải quyết cuộc gọi đầu (FCR)</div>
          <div className="text-2xl font-black text-slate-900">{metrics.fcrRatePercent}%</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Mục tiêu cam kết chất lượng: &gt; {metrics.fcrTargetPercent}%
          </p>
        </div>
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Điểm CSAT Tài xế đánh giá</div>
          <div className="text-2xl font-black text-amber-500">{metrics.driverRating} ★</div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Dựa trên {metrics.totalTickets} ticket được ghi nhận trong ca
          </p>
        </div>
      </div>

      {/* SLA Breakdown Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-800">
          Phân Tích SLA Chi Tiết Theo Nhóm Ưu Tiên
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 uppercase font-semibold">
              <th className="p-3">Hạng mục ưu tiên</th>
              <th className="p-3 text-center">Tổng số</th>
              <th className="p-3 text-center">Đạt SLA</th>
              <th className="p-3 text-center">Trễ hạn</th>
              <th className="p-3 text-right">Tỷ lệ hoàn thành</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slaBreakdown.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60">
                <td className="p-3 font-semibold text-slate-900">{row.type}</td>
                <td className="p-3 text-center font-bold text-slate-700">{row.total}</td>
                <td className="p-3 text-center font-bold text-emerald-600">{row.passed}</td>
                <td className="p-3 text-center font-bold text-rose-600">{row.failed}</td>
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-extrabold text-slate-900">{row.rate}%</span>
                    <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${row.rate >= 95 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${row.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
