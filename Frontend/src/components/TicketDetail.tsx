/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fraud Case Investigation & Adjudication Detail Workspace
 */

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Gavel, 
  CheckCircle2, 
  FileText, 
  Phone, 
  AlertTriangle, 
  IdCard, 
  Car, 
  ExternalLink, 
  Clock, 
  MapPin, 
  Coins, 
  Zap, 
  FileCheck2,
  Calendar,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { FraudCase, DecisionType, CaseDecision } from '../types';
import { AdjudicationModal } from './modals/AdjudicationModal';

interface TicketDetailProps {
  ticket: FraudCase;
  onUpdateTicket: (updated: FraudCase) => void;
  onCallDriver: (name: string, phone: string) => void;
  onChatDriver?: (name: string) => void;
  onResetStation?: (stationId: string) => void;
  onOpenMobileCharging?: () => void;
  onCloseTicket: (ticketId: string) => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  onUpdateTicket,
  onCallDriver,
}) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'evidence' | 'driver_history'>('explanation');
  const [adjudicationModal, setAdjudicationModal] = useState<{
    isOpen: boolean;
    type: DecisionType;
  }>({
    isOpen: false,
    type: 'tha_loi',
  });

  const handleOpenDecisionModal = (type: DecisionType) => {
    setAdjudicationModal({
      isOpen: true,
      type,
    });
  };

  const handleApplyDecision = (decisionData: {
    decisionType: DecisionType;
    fineAmount?: number;
    suspensionDays?: number;
    reason: string;
    messageToDriver: string;
  }) => {
    const updatedDecision: CaseDecision = {
      ...decisionData,
      decidedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' (Hôm nay)',
      officerName: 'Nguyễn Mai Chi',
      officerCode: 'GSM-INSPECT-88',
    };

    let updatedStatus: FraudCase['status'] = 'da_xu_phat';
    let updatedStatusLabel = 'Đã xử phạt vi phạm';

    if (decisionData.decisionType === 'tha_loi') {
      updatedStatus = 'da_tha_loi';
      updatedStatusLabel = 'Đã tha lỗi / Minh oan';
    } else if (decisionData.decisionType === 'canh_cao') {
      updatedStatus = 'da_canh_cao';
      updatedStatusLabel = 'Đã nhắc nhở & cảnh cáo';
    } else if (decisionData.decisionType === 'yeu_cau_bo_sung') {
      updatedStatus = 'yeu_cau_bo_sung';
      updatedStatusLabel = 'Đang chờ tài xế bổ sung chứng cứ';
    }

    const updatedCase: FraudCase = {
      ...ticket,
      status: updatedStatus,
      statusLabel: updatedStatusLabel,
      decision: updatedDecision,
    };

    onUpdateTicket(updatedCase);
  };

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col h-full">
      {/* Top Bar: Case ID, Combined Fraud & Severity, Status */}
      <div className="px-4 py-2 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-3 min-h-[42px]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-sm font-black text-slate-900 tracking-tight font-mono">
            HỒ SƠ #{ticket.id}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200/80">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>{ticket.fraudTypeLabel}</span>
            <span className="text-rose-300">•</span>
            <span className={`font-bold ${
              ticket.severity === 'nghiem_trong' ? 'text-rose-700' :
              ticket.severity === 'trung_binh' ? 'text-amber-700' : 'text-blue-700'
            }`}>
              {ticket.severityLabel}
            </span>
          </div>
        </div>

        {/* Current status badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border shadow-2xs ${
            ticket.status === 'da_tha_loi' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
            ticket.status === 'da_xu_phat' ? 'bg-rose-50 text-rose-800 border-rose-300' :
            ticket.status === 'da_nop_cho_duyet' ? 'bg-amber-50 text-amber-800 border-amber-300' :
            'bg-slate-100 text-slate-700 border-slate-300'
          }`}>
            {ticket.status === 'da_nop_cho_duyet' ? 'Chờ duyệt phán quyết' : ticket.statusLabel}
          </span>
        </div>
      </div>

      {/* Driver Identity Card - Compact 1-Row Streamlined */}
      <div className="px-4 py-2 bg-white border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
            {ticket.driver.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-slate-900">{ticket.driver.name}</span>
            <span className="text-slate-400 font-mono font-medium">({ticket.driver.id})</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <IdCard className="w-3.5 h-3.5 text-[#20B9BE]" />
            CCCD: {ticket.driver.cccd}
          </span>
          <span className="font-mono text-slate-600 font-medium">{ticket.driver.phone}</span>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <Car className="w-3.5 h-3.5 text-slate-400" />
            {ticket.driver.vehicleModel} - <strong className="font-mono text-slate-900">{ticket.driver.plate}</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200">
            <span className="text-slate-500 font-medium">Tín nhiệm:</span>
            <span className={`font-black ${
              ticket.driver.trustScore < 50 ? 'text-rose-600' : ticket.driver.trustScore < 75 ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              {ticket.driver.trustScore}/100
            </span>
          </div>

          <button
            id="btn-call-driver"
            data-testid="btn-call-driver"
            onClick={() => onCallDriver(ticket.driver.name, ticket.driver.phone)}
            className="px-2.5 py-1 btn-gsm-subtle rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Gọi thoại đối soát tài xế"
          >
            <Phone className="w-3.5 h-3.5 text-[#008284]" />
            <span>Gọi đối soát</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="px-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-2 text-sm">
        <button
          id="tab-detail-explanation"
          data-testid="tab-detail-explanation"
          onClick={() => setActiveTab('explanation')}
          className={`py-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'explanation'
              ? 'border-[#20B9BE] text-[#008284]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          Biên Bản Giải Trình Từ Tài Xế
          {ticket.explanation && (
            <span className="w-2 h-2 rounded-full bg-[#20B9BE]"></span>
          )}
        </button>
        <button
          id="tab-detail-evidence"
          data-testid="tab-detail-evidence"
          onClick={() => setActiveTab('evidence')}
          className={`py-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'evidence'
              ? 'border-[#20B9BE] text-[#008284]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Zap className="w-4 h-4" />
          Dữ Liệu & Bằng Chứng Hệ Thống (Telematics)
        </button>
        <button
          id="tab-detail-history"
          data-testid="tab-detail-history"
          onClick={() => setActiveTab('driver_history')}
          className={`py-2.5 px-4 font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'driver_history'
              ? 'border-[#20B9BE] text-[#008284]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Lịch Sử & Tiền Lệ Vi Phạm ({ticket.driver.priorViolationsCount})
        </button>
      </div>

      {/* Tab Content Workspace */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* TAB 1: DRIVER EXPLANATION */}
        {activeTab === 'explanation' && (
          <div className="space-y-4 flex flex-col">
            {ticket.explanation ? (
              <div className="space-y-3.5">
                {/* Status bar */}
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-600" />
                      Đã nộp biên bản qua GSM Driver
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-700 text-xs font-medium">
                      Nhóm lý do: <strong className="text-slate-900">{ticket.explanation.reasonCategory}</strong>
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Thời gian nộp: <strong>{ticket.explanation.submittedAt}</strong>
                  </span>
                </div>

                {/* Hero Reading Area: Formal Statement Document */}
                <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 shadow-xs border-l-4 border-l-[#20B9BE]">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#008284]" />
                      <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Nội Dung Bản Tường Trình / Lời Khai Của Tài Xế ({ticket.driver.name}):
                      </h4>
                    </div>
                    <span className="text-[11px] font-semibold text-[#008284] bg-[#20B9BE]/10 px-2 py-0.5 rounded">
                      Văn bản thẩm định HITL
                    </span>
                  </div>

                  <div 
                    id="reading-driver-statement"
                    data-testid="reading-driver-statement"
                    className="text-slate-900 text-[15px] sm:text-base leading-7 font-sans bg-slate-50/60 p-4 rounded-xl border border-slate-200/60 selection:bg-[#20B9BE]/20"
                  >
                    "{ticket.explanation.content}"
                  </div>
                </div>

                {/* Attachments */}
                {ticket.explanation.attachments && ticket.explanation.attachments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <span>Bằng Chứng Hình Ảnh & Tài Liệu Đính Kèm ({ticket.explanation.attachments.length}):</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {ticket.explanation.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-[#20B9BE] transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-[#20B9BE]" />
                            <div>
                              <div className="font-semibold text-slate-900 text-xs truncate max-w-[200px]">{att.name}</div>
                              <div className="text-xs text-slate-400">{att.sizeText || 'Ảnh đính kèm'}</div>
                            </div>
                          </div>
                          <a
                            href={att.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Xem
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-xs font-bold text-slate-800">Tài xế chưa nộp biên bản giải trình</h4>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Hệ thống đã gửi thông báo yêu cầu giải trình tới ứng dụng GSM Driver của tài xế. Thời hạn phản hồi còn {ticket.deadlineHours} giờ.
                </p>
                <button
                  onClick={() => handleOpenDecisionModal('yeu_cau_bo_sung')}
                  className="mt-2 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Gửi nhắc nhở hạn chót
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SYSTEM EVIDENCE & TELEMATICS */}
        {activeTab === 'evidence' && (
          <div className="space-y-3.5">
            {/* Anomaly Highlight Box */}
            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs mb-1">
                <AlertTriangle className="w-4 h-4" />
                Dấu Hiệu Gian Lận AI Telematics Phát Hiện:
              </div>
              <p className="text-slate-800 text-xs leading-relaxed font-medium mb-2">
                {ticket.evidence.anomalyTitle}
              </p>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {ticket.evidence.anomalyDescription}
              </p>
            </div>

            {/* Trip Details & Metric comparison */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Cước cuốc xe</span>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  {ticket.evidence.fareAmount.toLocaleString('vi-VN')} đ
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Tiền thưởng chuyến</span>
                <div className="text-sm font-black text-rose-600 mt-0.5">
                  {ticket.evidence.bonusClaimed.toLocaleString('vi-VN')} đ
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Quãng đường App</span>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  {ticket.evidence.gpsDistanceKm} km
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Thực tế xe chạy (T-Box)</span>
                <div className="text-sm font-black text-rose-700 mt-0.5">
                  {ticket.evidence.telematicsActualKm} km
                </div>
              </div>
            </div>

            {/* Pickup / Dropoff */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Điểm đón: <strong>{ticket.evidence.pickup}</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>Điểm trả: <strong>{ticket.evidence.dropoff}</strong></span>
              </div>
            </div>

            {/* Telematics Event Log */}
            {ticket.evidence.telematicsLogs && ticket.evidence.telematicsLogs.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Nhật Ký Tín Hiệu Hộp Đen Xe VinFast:
                </h4>
                <div className="space-y-1.5">
                  {ticket.evidence.telematicsLogs.map((log) => (
                    <div key={log.id} className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[10px]">{log.time}</span>
                        <span className="font-bold text-slate-800">{log.event}:</span>
                        <span className="text-slate-600">{log.detail}</span>
                      </div>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        log.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {log.severity.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DRIVER COMPLIANCE HISTORY */}
        {activeTab === 'driver_history' && (
          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Hồ Sơ Lý Lịch Tuân Thủ (Dữ Liệu Theo CCCD)</h4>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Số CCCD: <strong>{ticket.driver.cccd}</strong> • Tổng chuyến: {ticket.driver.completedRides}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Tiền lệ vi phạm: </span>
                <strong className={ticket.driver.priorViolationsCount > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                  {ticket.driver.priorViolationsCount} lần
                </strong>
              </div>
            </div>

            <div className="text-slate-600 text-xs leading-relaxed p-2">
              {ticket.driver.priorViolationsCount === 0 ? (
                <div className="text-emerald-700 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Tài xế này chưa từng có tiền lệ bị lập biên bản gian lận trước đây. Đây là lần đầu phát sinh nghi vấn.
                </div>
              ) : (
                <div className="text-amber-800 font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Tài xế đã có {ticket.driver.priorViolationsCount} lần bị lập biên bản kiểm soát. Cần cân nhắc khung xử phạt tăng nặng nếu tiếp tục tái phạm.
                </div>
              )}
            </div>
          </div>
        )}

        {/* DECISION SUMMARY BANNER (If already decided) */}
        {ticket.decision && (
          <div className={`p-4 rounded-xl border space-y-2 mt-4 ${
            ticket.decision.decisionType === 'tha_loi'
              ? 'bg-emerald-50/80 border-emerald-300'
              : 'bg-rose-50/80 border-rose-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {ticket.decision.decisionType === 'tha_loi' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Gavel className="w-5 h-5 text-rose-600" />
                )}
                <h4 className="text-xs font-black uppercase tracking-wide">
                  {ticket.decision.decisionType === 'tha_loi'
                    ? 'PHÁN QUYẾT: THA LỖI & MIỄN XỬ PHẠT'
                    : `PHÁN QUYẾT: XỬ PHẠT VI PHẠM GIAN LẬN`}
                </h4>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Ban hành: {ticket.decision.decidedAt} bởi {ticket.decision.officerName}
              </span>
            </div>

            <div className="text-xs text-slate-800 leading-relaxed font-sans">
              <strong>Căn cứ:</strong> {ticket.decision.reason}
            </div>

            {ticket.decision.fineAmount !== undefined && ticket.decision.fineAmount > 0 && (
              <div className="text-xs text-rose-700 font-bold">
                • Mức phạt tiền / Truy thu: {ticket.decision.fineAmount.toLocaleString('vi-VN')} VNĐ (Khấu trừ ví)
              </div>
            )}

            {ticket.decision.suspensionDays !== undefined && ticket.decision.suspensionDays > 0 && (
              <div className="text-xs text-rose-700 font-bold">
                • Thời hạn đình chỉ tài khoản: {ticket.decision.suspensionDays === 999 ? 'Khóa vĩnh viễn' : `${ticket.decision.suspensionDays} ngày`}
              </div>
            )}

            <div className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-lg border border-slate-200/60 mt-1">
              <strong>Đã gửi về app tài xế:</strong> "{ticket.decision.messageToDriver}"
            </div>
          </div>
        )}
      </div>

      {/* Bottom Adjudication Action Bar */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5 shrink-0">
          <span>Quyền hạn trực ban:</span>
          <strong className="text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 font-bold">Ban Kiểm Soát Tuân Thủ GSM</strong>
        </div>

        {/* 4 Action Buttons - Ergonomically Enhanced with IDs & TestIDs */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
          {/* 1. Tha lỗi / Minh oan */}
          <button
            id="btn-adjudicate-dismiss"
            data-testid="btn-adjudicate-dismiss"
            onClick={() => handleOpenDecisionModal('tha_loi')}
            className="px-3.5 py-2.5 btn-gsm-success font-bold rounded-xl text-sm flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap active:scale-[0.98]"
            title="Miễn trách nhiệm cho tài xế khi có đủ căn cứ chính đáng"
          >
            <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
            <span>Tha Lỗi / Minh Oan</span>
          </button>

          {/* 2. Cảnh cáo nhắc nhở */}
          <button
            id="btn-adjudicate-warn"
            data-testid="btn-adjudicate-warn"
            onClick={() => handleOpenDecisionModal('canh_cao')}
            className="px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors whitespace-nowrap active:scale-[0.98]"
            title="Lập văn bản cảnh cáo và nhắc nhở vào hồ sơ tài xế"
          >
            <AlertTriangle className="w-4.5 h-4.5 shrink-0" />
            <span>Cảnh Cáo</span>
          </button>

          {/* 3. Yêu cầu bổ sung */}
          <button
            id="btn-adjudicate-request-info"
            data-testid="btn-adjudicate-request-info"
            onClick={() => handleOpenDecisionModal('yeu_cau_bo_sung')}
            className="px-3 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold rounded-xl text-sm flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap active:scale-[0.98] shadow-2xs"
            title="Yêu cầu tài xế gửi thêm hình ảnh hoặc biên lai đối soát"
          >
            <FileText className="w-4.5 h-4.5 text-sky-600 shrink-0" />
            <span>Yêu Cầu Bổ Sung</span>
          </button>

          {/* 4. Ra quyết định xử phạt */}
          <button
            id="btn-adjudicate-penalize"
            data-testid="btn-adjudicate-penalize"
            onClick={() => handleOpenDecisionModal('xu_phat_tien')}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-sm flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors whitespace-nowrap active:scale-[0.98]"
            title="Khấu trừ tiền phạt hoặc áp dụng chế tài vi phạm quy chế"
          >
            <Gavel className="w-4.5 h-4.5 shrink-0" />
            <span>Ra Quyết Định Xử Phạt</span>
          </button>
        </div>
      </div>

      {/* Adjudication Modal */}
      <AdjudicationModal
        isOpen={adjudicationModal.isOpen}
        onClose={() => setAdjudicationModal({ ...adjudicationModal, isOpen: false })}
        caseItem={ticket}
        initialType={adjudicationModal.type}
        onSubmitDecision={handleApplyDecision}
      />
    </div>
  );
};
