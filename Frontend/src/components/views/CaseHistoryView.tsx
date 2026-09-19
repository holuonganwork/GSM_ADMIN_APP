/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Case History View (Lịch Sử Phán Quyết & Xử Lý Hồ Sơ Gian Lận)
 */

import React, { useState } from 'react';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  Gavel,
  ShieldAlert,
  IdCard,
  Car,
  Phone,
  FileText,
  Eye,
  X,
  Coins
} from 'lucide-react';
import { FraudCase } from '../../types';

interface CaseHistoryViewProps {
  cases: FraudCase[];
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  selectedFraudType?: string;
  selectedSeverity?: string;
  onCallDriver: (name: string, phone: string) => void;
  onOpenCaseModal?: (caseItem: FraudCase) => void;
}

export const CaseHistoryView: React.FC<CaseHistoryViewProps> = ({
  cases,
  searchQuery = '',
  selectedFraudType = 'all',
  selectedSeverity = 'all',
  onCallDriver,
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'da_tha_loi' | 'da_xu_phat' | 'da_canh_cao'>('all');
  const [selectedHistoryCase, setSelectedHistoryCase] = useState<FraudCase | null>(null);

  // Filter cases
  const filteredCases = cases.filter((c) => {
    // Only processed cases
    const isProcessed = c.status === 'da_tha_loi' || c.status === 'da_xu_phat' || c.status === 'da_canh_cao';
    if (!isProcessed) return false;

    // Status filter
    if (statusFilter !== 'all' && c.status !== statusFilter) {
      return false;
    }

    // Fraud type
    if (selectedFraudType !== 'all' && c.fraudType !== selectedFraudType) {
      return false;
    }

    // Severity
    if (selectedSeverity !== 'all' && c.severity !== selectedSeverity) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchPlate = c.driver.plate.toLowerCase().includes(q);
      const matchCccd = c.driver.cccd.toLowerCase().includes(q);
      const matchDriver = c.driver.name.toLowerCase().includes(q);
      const matchDriverId = c.driver.id.toLowerCase().includes(q);
      const matchType = c.fraudTypeLabel.toLowerCase().includes(q);
      const matchReason = c.decision?.reason?.toLowerCase().includes(q) || false;
      const matchOfficer = c.decision?.officerName?.toLowerCase().includes(q) || false;

      if (!matchId && !matchPlate && !matchCccd && !matchDriver && !matchDriverId && !matchType && !matchReason && !matchOfficer) {
        return false;
      }
    }

    return true;
  });

  const getDecisionBadge = (c: FraudCase) => {
    if (c.status === 'da_tha_loi' || c.decision?.decisionType === 'tha_loi') {
      return {
        label: 'Đã tha lỗi / Minh oan',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        icon: CheckCircle2,
        iconColor: 'text-emerald-600',
      };
    }
    if (c.decision?.decisionType === 'canh_cao' || c.status === 'da_canh_cao') {
      return {
        label: 'Cảnh cáo & Nhắc nhở',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
        icon: AlertTriangle,
        iconColor: 'text-amber-600',
      };
    }
    return {
      label: 'Đã xử phạt vi phạm',
      badgeClass: 'bg-rose-50 text-rose-800 border-rose-300',
      icon: Gavel,
      iconColor: 'text-rose-600',
    };
  };

  const exoneratedCount = cases.filter((c) => c.status === 'da_tha_loi').length;
  const penalizedCount = cases.filter((c) => c.status === 'da_xu_phat').length;
  const warnedCount = cases.filter((c) => c.status === 'da_canh_cao').length;

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col p-4 space-y-3.5">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-[#20B9BE]" />
            Lịch Sử Phán Quyết & Hồ Sơ Đã Xử Lý ({cases.length} hồ sơ)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xem lại toàn bộ hồ sơ vi phạm đã hoàn tất thẩm định, quyết định chế tài và biên bản giải trình
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white text-[#006768] font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({cases.length})
          </button>
          <button
            onClick={() => setStatusFilter('da_tha_loi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'da_tha_loi'
                ? 'bg-white text-emerald-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã tha lỗi ({exoneratedCount})
          </button>
          <button
            onClick={() => setStatusFilter('da_xu_phat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'da_xu_phat'
                ? 'bg-white text-rose-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã xử phạt ({penalizedCount})
          </button>
          {warnedCount > 0 && (
            <button
              onClick={() => setStatusFilter('da_canh_cao')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'da_canh_cao'
                  ? 'bg-white text-amber-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cảnh cáo ({warnedCount})
            </button>
          )}
        </div>
      </div>

      {/* Case Table / List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCases.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <History className="w-6 h-6 text-[#20B9BE]" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">Không tìm thấy hồ sơ nào trong lịch sử</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `Không có kết quả nào khớp với từ khóa "${searchQuery}".`
                : 'Chưa có hồ sơ vi phạm nào được đưa vào lịch sử xử lý.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCases.map((c) => {
              const decisionMeta = getDecisionBadge(c);
              const DecisionIcon = decisionMeta.icon;

              return (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200/90 hover:border-[#20B9BE]/60 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-all space-y-3"
                >
                  {/* Top row: Case ID, Driver info, Verdict Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-sm font-black font-mono text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                        #{c.id}
                      </span>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                        <span>{c.driver.name}</span>
                        <span className="text-xs text-slate-400 font-mono font-medium">({c.driver.id})</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-mono font-semibold text-slate-700 flex items-center gap-1">
                        <IdCard className="w-3.5 h-3.5 text-[#20B9BE]" />
                        CCCD: {c.driver.cccd}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-medium text-slate-600 flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-slate-400" />
                        {c.driver.vehicleModel} - <strong className="font-mono text-slate-800">{c.driver.plate}</strong>
                      </span>
                    </div>

                    {/* Verdict badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border shadow-2xs flex items-center gap-1.5 ${decisionMeta.badgeClass}`}>
                        <DecisionIcon className={`w-3.5 h-3.5 ${decisionMeta.iconColor}`} />
                        <span>{decisionMeta.label}</span>
                      </span>

                      <button
                        onClick={() => setSelectedHistoryCase(c)}
                        className="px-2.5 py-1 btn-gsm-subtle rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                        title="Xem chi tiết biên bản giải trình"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#008284]" />
                        <span>Xem chi tiết</span>
                      </button>

                      <button
                        onClick={() => onCallDriver(c.driver.name, c.driver.phone)}
                        className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-[#008284] cursor-pointer"
                        title="Gọi tài xế"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle row: Fraud info & Decision Summary */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Left: Vi phạm */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span className="font-bold text-slate-800">{c.fraudTypeLabel}</span>
                        <span className="text-slate-300">•</span>
                        <span className="font-semibold text-rose-700">Mức độ: {c.severityLabel}</span>
                      </div>
                      <p className="text-slate-500 line-clamp-2">
                        {c.evidence.anomalyDescription || c.evidence.anomalyTitle}
                      </p>
                    </div>

                    {/* Right: Phán quyết */}
                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-slate-200 md:pl-3 pt-2 md:pt-0">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Cán bộ thẩm định: <strong className="text-slate-800">{c.decision?.officerName || 'Nguyễn Mai Chi'}</strong></span>
                        <span className="font-mono">{c.decision?.decidedAt || c.createdAt}</span>
                      </div>
                      {c.decision?.fineAmount ? (
                        <div className="font-bold text-rose-700 flex items-center gap-1.5">
                          <Coins className="w-3.5 h-3.5 text-rose-600" />
                          Tiền phạt khấu trừ: {c.decision.fineAmount.toLocaleString('vi-VN')} VNĐ
                          {c.decision.suspensionDays ? ` • Đình chỉ: ${c.decision.suspensionDays} ngày` : ''}
                        </div>
                      ) : null}
                      <p className="text-slate-700 font-medium line-clamp-1 italic">
                        "{c.decision?.reason || 'Hồ sơ đã được lưu trữ trong kho lưu trữ tuân thủ.'}"
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Case Detail Dossier Modal */}
      {selectedHistoryCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="text-base font-black font-mono text-slate-900">
                  HỒ SƠ #{selectedHistoryCase.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getDecisionBadge(selectedHistoryCase).badgeClass}`}>
                  {getDecisionBadge(selectedHistoryCase).label}
                </span>
              </div>
              <button
                onClick={() => setSelectedHistoryCase(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Driver Card */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{selectedHistoryCase.driver.name} ({selectedHistoryCase.driver.id})</h4>
                  <p className="text-slate-500 mt-0.5">
                    CCCD: <strong className="font-mono text-slate-800">{selectedHistoryCase.driver.cccd}</strong> • SĐT: {selectedHistoryCase.driver.phone} • Xe: {selectedHistoryCase.driver.vehicleModel} ({selectedHistoryCase.driver.plate})
                  </p>
                </div>
                <button
                  onClick={() => onCallDriver(selectedHistoryCase.driver.name, selectedHistoryCase.driver.phone)}
                  className="px-3 py-1.5 btn-gsm-subtle rounded-xl font-bold flex items-center gap-1.5 cursor-pointer text-xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#008284]" />
                  Gọi đối soát
                </button>
              </div>

              {/* Driver Statement */}
              {selectedHistoryCase.explanation && (
                <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-[11px] pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#008284]" />
                      Bản Tường Trình / Lời Khai Tài Xế
                    </span>
                    <span className="font-mono">Nộp lúc: {selectedHistoryCase.explanation.submittedAt}</span>
                  </div>
                  <p className="text-slate-800 leading-relaxed bg-slate-50/70 p-3 rounded-lg border border-slate-200/60 font-sans">
                    "{selectedHistoryCase.explanation.content}"
                  </p>
                </div>
              )}

              {/* Final Decision Record */}
              {selectedHistoryCase.decision && (
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 space-y-2.5">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Gavel className="w-4 h-4 text-slate-700" />
                    Biên Bản Phán Quyết Chính Thức
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 text-xs">
                    <div>Cán bộ quyết định: <strong>{selectedHistoryCase.decision.officerName}</strong></div>
                    <div>Thời điểm: <strong>{selectedHistoryCase.decision.decidedAt}</strong></div>
                    {selectedHistoryCase.decision.fineAmount ? (
                      <div className="text-rose-700 font-bold col-span-2">
                        Tiền phạt khấu trừ: {selectedHistoryCase.decision.fineAmount.toLocaleString('vi-VN')} VNĐ
                      </div>
                    ) : null}
                    {selectedHistoryCase.decision.suspensionDays ? (
                      <div className="text-rose-700 font-bold col-span-2">
                        Thời hạn tạm đình chỉ tài khoản: {selectedHistoryCase.decision.suspensionDays} ngày
                      </div>
                    ) : null}
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium">
                    <strong>Căn cứ phán quyết:</strong> {selectedHistoryCase.decision.reason}
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200 text-emerald-900">
                    <strong>Thông điệp gửi về app tài xế:</strong> "{selectedHistoryCase.decision.messageToDriver}"
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedHistoryCase(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-semibold text-xs cursor-pointer transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
