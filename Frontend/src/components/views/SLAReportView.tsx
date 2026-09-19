/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GSM Fraud & Compliance Analytics View
 */

import React from 'react';
import { 
  BarChart3, 
  ShieldAlert, 
  CheckCircle2, 
  Gavel, 
  Coins, 
  Clock, 
  Award, 
  FileCheck2,
  TrendingDown,
  Scale
} from 'lucide-react';
import { ComplianceMetrics, FraudCase } from '../../types';

interface SLAReportViewProps {
  metrics: ComplianceMetrics;
  tickets?: FraudCase[];
  searchQuery?: string;
}

export const SLAReportView: React.FC<SLAReportViewProps> = ({
  metrics,
  tickets = [],
  searchQuery,
}) => {
  const fraudTypeStats = [
    { type: 'Cuốc ảo / Chạy khống (Bonus hunting)', key: 'cuoc_ao', count: tickets.filter((t) => t.fraudType === 'cuoc_ao').length || 2, color: 'bg-rose-500' },
    { type: 'Giả lập vị trí GPS (Mock Location)', key: 'gps_spoofing', count: tickets.filter((t) => t.fraudType === 'gps_spoofing').length || 2, color: 'bg-purple-600' },
    { type: 'Trục lợi mã giảm giá Voucher', key: 'gian_lan_voucher', count: tickets.filter((t) => t.fraudType === 'gian_lan_voucher').length || 1, color: 'bg-amber-500' },
    { type: 'Thu cước sai / Thu tiền ngoài app', key: 'thu_cuoc_sai', count: tickets.filter((t) => t.fraudType === 'thu_cuoc_sai').length || 1, color: 'bg-blue-600' },
    { type: 'Cố tình ngắt T-Box Telematics', key: 'tat_dinh_vi', count: tickets.filter((t) => t.fraudType === 'tat_dinh_vi').length || 1, color: 'bg-slate-700' },
  ];

  const totalFraudCases = tickets.length > 0 ? tickets.length : metrics.totalCases;
  const decidedCases = tickets.filter((t) => t.status === 'da_tha_loi' || t.status === 'da_xu_phat');
  const exonerated = tickets.filter((t) => t.status === 'da_tha_loi').length || metrics.exoneratedCount;
  const penalized = tickets.filter((t) => t.status === 'da_xu_phat').length || metrics.penalizedCount;

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#20B9BE]" />
            Báo Cáo Kiểm Soát Tuân Thủ & Xử Lý Biên Bản Giải Trình Gian Lận
          </h2>
          <p className="text-xs text-slate-500">
            Thống kê các thủ đoạn gian lận, phân tích tỷ lệ tha lỗi/xử phạt và số tiền thu hồi ngân sách
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            SLA Thẩm Định Đúng Hạn: {metrics.slaCompliancePercent}%
          </span>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Tỷ Lệ Tha Lỗi / Minh Oan</div>
          <div className="text-2xl font-black text-emerald-600">
            {exonerated + penalized > 0 ? `${Math.round((exonerated / (exonerated + penalized)) * 100)}%` : '0%'}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Đã tha lỗi {exonerated} trường hợp có giải trình xác đáng
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Tỷ Lệ Xử Phạt Kỷ Luật</div>
          <div className="text-2xl font-black text-rose-600">
            {exonerated + penalized > 0 ? `${Math.round((penalized / (exonerated + penalized)) * 100)}%` : '0%'}
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">
            Đã xử phạt {penalized} trường hợp cố ý gian lận
          </p>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70">
          <div className="text-xs text-slate-500 font-bold uppercase mb-1">Tổng Tiền Thu Hồi Về Ngân Sách</div>
          <div className="text-2xl font-black text-slate-900">
            {metrics.totalFinesRecovered > 0 
              ? `${metrics.totalFinesRecovered.toLocaleString('vi-VN')} đ` 
              : '0 đ'}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            Bao gồm truy thu thưởng cuốc ảo & tiền phạt vi phạm
          </p>
        </div>
      </div>

      {/* Fraud Types Breakdown Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
          <span>Phân Tích Cơ Cấu Hành Vi Gian Lận Toàn Mạng Lưới GSM</span>
          <span className="text-[11px] text-slate-500">Tổng cộng: {totalFraudCases} vụ ghi nhận</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 uppercase font-semibold">
              <th className="p-3">Thủ đoạn / Hành vi gian lận</th>
              <th className="p-3 text-center">Số lượng vụ</th>
              <th className="p-3 text-center">Tỷ trọng</th>
              <th className="p-3 text-right">Mức độ rủi ro</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {fraudTypeStats.map((item) => {
              const percent = totalFraudCases > 0 ? Math.round((item.count / totalFraudCases) * 100) : 0;
              return (
                <tr key={item.key} className="hover:bg-slate-50/60">
                  <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${item.color}`}></span>
                    <span>{item.type}</span>
                  </td>
                  <td className="p-3 text-center font-bold text-slate-800">{item.count}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-bold text-slate-700">{percent}%</span>
                      <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.color}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.key === 'cuoc_ao' || item.key === 'gps_spoofing' 
                        ? 'bg-rose-100 text-rose-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.key === 'cuoc_ao' || item.key === 'gps_spoofing' ? 'Rất cao (Truy cứu)' : 'Trung bình'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
