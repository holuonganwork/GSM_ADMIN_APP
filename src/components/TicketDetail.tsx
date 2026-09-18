/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Ticket } from '../types';
import { 
  Printer, 
  Share2, 
  ChevronRight, 
  User, 
  Clock, 
  BatteryCharging, 
  BatteryLow,
  Zap, 
  Sparkles, 
  Phone, 
  MessageSquare, 
  RotateCw, 
  Truck, 
  CheckCircle2, 
  Save, 
  AlertCircle,
  Radio,
  ExternalLink,
  Lock,
  Plus
} from 'lucide-react';

interface TicketDetailProps {
  ticket: Ticket;
  onUpdateTicket: (updated: Ticket) => void;
  onCallDriver: (driverName: string, phone: string) => void;
  onChatDriver: (driverName: string) => void;
  onResetStation: (stationId: string) => void;
  onOpenMobileCharging: () => void;
  onCloseTicket: (ticketId: string) => void;
}

export const TicketDetail: React.FC<TicketDetailProps> = ({
  ticket,
  onUpdateTicket,
  onCallDriver,
  onChatDriver,
  onResetStation,
  onOpenMobileCharging,
  onCloseTicket,
}) => {
  const [resolutionAction, setResolutionAction] = useState(ticket.resolution.action);
  const [rootCause, setRootCause] = useState(ticket.resolution.rootCause);
  const [internalNote, setInternalNote] = useState(ticket.resolution.internalNote);
  const [driverMessage, setDriverMessage] = useState(ticket.resolution.driverMessage);
  const [autoVoucher, setAutoVoucher] = useState(ticket.resolution.autoVoucher);
  const [reportVGreen, setReportVGreen] = useState(ticket.resolution.reportVGreen);
  const [newLogText, setNewLogText] = useState('');
  const [showAddLog, setShowAddLog] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApplyAISolution = () => {
    setResolutionAction('Hướng dẫn đổi trụ sạc lân cận & cấp voucher 50k');
    setRootCause('Lỗi phần mềm trụ sạc (Firmware handshake timeout)');
    setAutoVoucher(true);
    setReportVGreen(true);
    setDriverMessage(
      'Green SM CSKH: Đã gửi lệnh mở khóa Trụ 04. Bác tài vui lòng chuyển sang Trụ #06 để tiếp tục sạc nhanh. Hệ thống đã tặng voucher 50.000đ vào ví GSM Driver của Bác tài.'
    );

    // Also add an automatic log entry
    const newLog = {
      id: `h-${Date.now()}`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      source: 'AI Dispatch Auto-Assistant',
      badge: 'Đã áp dụng đề xuất',
      badgeType: 'auto' as const,
      text: 'Đã kích hoạt phương án mở khóa chốt Trụ 04, điều hướng xe sang Trụ 06 và lập lệnh giải ngân voucher 50.000đ.',
    };

    onUpdateTicket({
      ...ticket,
      history: [...ticket.history, newLog],
    });

    showToast('Đã tự động điền và áp dụng phương án tối ưu từ AI Dispatch!');
  };

  const handleInsertMacro = () => {
    setDriverMessage(
      'Green SM CSKH: Trụ #' + (ticket.chargingStation ? '04' : '01') + 
      ' đã được kiểm tra và xử lý. Bác tài vui lòng thực hiện theo hướng dẫn trên ứng dụng GSM Driver. Chúc Bác tài vạn dặm bình an!'
    );
    showToast('Đã chèn nội dung tin nhắn macro mẫu.');
  };

  const handleAddTimelineLog = () => {
    if (!newLogText.trim()) return;

    const newLog = {
      id: `h-${Date.now()}`,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      source: `Điều phối viên ${ticket.coordinator}`,
      badge: 'Ghi nhận mới',
      badgeType: 'agent' as const,
      text: newLogText.trim(),
    };

    onUpdateTicket({
      ...ticket,
      history: [...ticket.history, newLog],
    });

    setNewLogText('');
    setShowAddLog(false);
    showToast('Đã thêm ghi nhận vào dòng sự kiện ticket!');
  };

  const handleSaveProgress = () => {
    onUpdateTicket({
      ...ticket,
      resolution: {
        ...ticket.resolution,
        action: resolutionAction,
        rootCause,
        internalNote,
        driverMessage,
        autoVoucher,
        reportVGreen,
      },
    });
    showToast('Đã lưu tiến độ xử lý ticket thành công!');
  };

  const handleCompleteAndClose = () => {
    onCloseTicket(ticket.id);
  };

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col relative">
      {/* Toast alert notification */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#20B9BE]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Detail Header matching Image 4 */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-rose-600 text-white font-extrabold text-xs rounded-md tracking-wide">
              {ticket.priority === 'P1' ? 'P1 KHẨN CẤP' : `${ticket.priority} ƯU TIÊN`}
            </span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              #{ticket.id} • {ticket.title}
            </h2>
          </div>

          {/* Action buttons: Print, Share, Chuyển cấp */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()} 
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
              title="In phiếu ticket"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button 
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                showToast('Đã sao chép liên kết ticket vào clipboard');
              }}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors"
              title="Chia sẻ ticket"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => showToast('Đã chuyển tiếp ticket lên Trưởng ca Điều phối GSM!')}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-semibold rounded-md border border-slate-200 transition-colors cursor-pointer"
            >
              <span className="text-[#20B9BE] font-bold">»</span>
              <span>Chuyển cấp</span>
            </button>
          </div>
        </div>

        {/* Metadata sub-row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Điều phối viên: <strong className="text-slate-900 font-semibold">{ticket.coordinator}</strong></span>
          </div>
          <div className="w-[1px] h-3 bg-slate-200"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Khởi tạo: <strong className="text-slate-900 font-semibold">{ticket.createdAt}</strong></span>
          </div>
          <div className="w-[1px] h-3 bg-slate-200"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>Thời hạn cam kết SLA: <strong className="text-slate-900 font-semibold">{ticket.slaDeadline}</strong></span>
            <span className="text-rose-600 font-bold ml-0.5">
              ({ticket.slaRemainingSeconds < 0 ? `Quá hạn ${Math.abs(Math.floor(ticket.slaRemainingSeconds / 60))}p` : 'Còn 05:42'})
            </span>
          </div>
        </div>
      </div>

      {/* Main Scrollable Detail Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40">
        {/* Section 1: DỮ LIỆU TELEMETRY & TÌNH TRẠNG XE ĐIỆN VINFAST */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#20B9BE] animate-pulse" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                DỮ LIỆU TELEMETRY & TÌNH TRẠNG XE ĐIỆN VINFAST
              </h3>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Sync Telematics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Box 1: SoC */}
            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-1">
                <span>Mức pin xe (SoC)</span>
                <BatteryLow className="w-4 h-4 text-rose-600" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-rose-600 tracking-tight">
                  {ticket.vehicle.batterySoC}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Ước tính: ~{ticket.vehicle.estimatedKm} km
                </span>
              </div>
              {/* Battery progress visual */}
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full rounded-full ${ticket.vehicle.batterySoC < 15 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${ticket.vehicle.batterySoC}%` }}
                ></div>
              </div>
            </div>

            {/* Box 2: Vehicle Status */}
            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60">
              <div className="text-xs text-slate-600 font-medium mb-1">Tình trạng vận hành</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">{ticket.vehicle.model}</span>
                <span className="font-mono text-xs font-bold bg-slate-200/70 text-slate-800 px-1.5 py-0.5 rounded">
                  {ticket.vehicle.plate}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-slate-200/60 text-slate-700 text-[11px] font-semibold rounded">
                  {ticket.vehicle.status}
                </span>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-mono font-bold rounded border border-rose-200">
                  {ticket.vehicle.bmsCode}
                </span>
              </div>
            </div>

            {/* Box 3: Charging Station */}
            <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/60">
              <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-1">
                <span>Trụ sạc kết nối</span>
                <Zap className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-slate-900">
                {ticket.chargingStation?.name || 'Trụ sạc thông minh V-GREEN'}
              </div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">
                {ticket.chargingStation?.hub || ticket.vehicle.location}
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[11px]">
                <span className="flex items-center gap-1 text-rose-600 font-semibold">
                  <Lock className="w-3 h-3" />
                  {ticket.chargingStation?.status || 'Bình thường'}
                </span>
                <span className="font-mono text-slate-500 text-[10px]">
                  {ticket.chargingStation?.stationId || 'VG-HN-0482'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: GỢI Ý AI DISPATCH GREEN SM */}
        <div className="bg-[#E3F8F8]/60 border border-[#20B9BE]/40 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-[#006768] font-bold text-xs uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#20B9BE]" />
              <span>GỢI Ý AI DISPATCH GREEN SM</span>
            </div>
            <span className="text-[11px] font-bold text-[#006768] bg-[#20B9BE]/20 px-2 py-0.5 rounded-full">
              Độ tin cậy: {ticket.aiRecommendation.confidence}%
            </span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-normal mb-3">
            {ticket.aiRecommendation.text}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-apply-ai-solution"
              onClick={handleApplyAISolution}
              className="px-3.5 py-1.5 bg-[#008284] hover:bg-[#006f71] text-white text-xs font-bold rounded-lg transition-all shadow-xs active:scale-98"
            >
              {ticket.aiRecommendation.actionText}
            </button>
            <button
              onClick={onOpenMobileCharging}
              className="text-xs text-[#006768] hover:text-[#004f50] font-semibold underline underline-offset-2 transition-colors cursor-pointer"
            >
              {ticket.aiRecommendation.subActionText || 'Xem xe sạc lưu động khả dụng (2 xe gần nhất)'}
            </button>
          </div>
        </div>

        {/* Section 3: TIẾN TRÌNH TRAO ĐỔI & LỊCH SỬ GHI NHẬN */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                TIẾN TRÌNH TRAO ĐỔI & LỊCH SỬ GHI NHẬN
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                ({ticket.history.length} bản ghi)
              </span>
            </div>
            <button
              onClick={() => setShowAddLog(!showAddLog)}
              className="text-[11px] font-semibold text-[#008284] hover:text-[#006768] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm ghi chú ca
            </button>
          </div>

          {/* New log input box toggle */}
          {showAddLog && (
            <div className="mb-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
              <textarea
                value={newLogText}
                onChange={(e) => setNewLogText(e.target.value)}
                placeholder="Nhập nội dung trao đổi hoặc lệnh điều phối mới..."
                className="w-full text-xs p-2 bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#20B9BE] min-h-[60px]"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowAddLog(false)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddTimelineLog}
                  className="px-3 py-1 bg-[#008284] text-white text-xs font-semibold rounded-md hover:bg-[#006f71]"
                >
                  Lưu vào lịch sử
                </button>
              </div>
            </div>
          )}

          {/* Timeline entries */}
          <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-slate-200">
            {ticket.history.map((item) => {
              const isCall = item.badgeType === 'call' || item.source.includes('Nguyễn Mai Chi');
              const isSystem = item.badgeType === 'system';
              const isAuto = item.badgeType === 'auto';

              return (
                <div key={item.id} className="relative flex items-start gap-3 pl-1 text-xs">
                  {/* Icon dot */}
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    isCall ? 'bg-emerald-100 text-emerald-700' :
                    isSystem ? 'bg-rose-100 text-rose-700' :
                    isAuto ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isCall ? <Phone className="w-2.5 h-2.5" /> :
                     isSystem ? <AlertCircle className="w-2.5 h-2.5" /> :
                     <Radio className="w-2.5 h-2.5" />}
                  </div>

                  <div className="flex-1 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200/60">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-[11px]">
                        {item.time} - {item.source}
                      </span>
                      <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: KHU VỰC XỬ LÝ & KẾT LUẬN TICKET */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              KHU VỰC XỬ LÝ & KẾT LUẬN TICKET
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Thẩm quyền: {ticket.resolution.authorityLevel}
            </span>
          </div>

          {/* Quick Action Buttons (Gọi tài xế, Chat điều phối, Reset trụ sạc, Điều xe sạc lưu động) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              id="btn-call-driver"
              onClick={() => onCallDriver(ticket.driver.name, ticket.driver.phone)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs active:scale-98"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi tài xế</span>
            </button>

            <button
              id="btn-chat-driver"
              onClick={() => onChatDriver(ticket.driver.name)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-all active:scale-98"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#20B9BE]" />
              <span>Chat điều phối</span>
            </button>

            <button
              id="btn-reset-station"
              onClick={() => onResetStation(ticket.chargingStation?.stationId || 'VG-HN-0482')}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-all active:scale-98"
            >
              <RotateCw className="w-3.5 h-3.5 text-slate-600" />
              <span>Reset trụ sạc</span>
            </button>

            <button
              id="btn-mobile-charging"
              onClick={onOpenMobileCharging}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-all active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Điều xe sạc lưu động</span>
            </button>
          </div>

          {/* Resolution Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Hành động giải quyết <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-resolution-action"
                value={resolutionAction}
                onChange={(e) => setResolutionAction(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-[#20B9BE]"
              >
                <option value="Hướng dẫn đổi trụ sạc lân cận & cấp voucher">
                  Hướng dẫn đổi trụ sạc lân cận & cấp voucher
                </option>
                <option value="Cử Đội cơ động GSM đến xử lý trực tiếp">
                  Cử Đội cơ động GSM đến xử lý trực tiếp
                </option>
                <option value="Tài xế quay đầu bàn giao tài sản tại Quầy CSKH Ga T1">
                  Tài xế quay đầu bàn giao tài sản tại Quầy CSKH
                </option>
                <option value="Reset modem viễn thông T-Box và khôi phục đồng bộ bản đồ">
                  Reset modem viễn thông T-Box và khôi phục đồng bộ bản đồ
                </option>
                <option value="Hỗ trợ thông tin chính sách & nghiệp vụ ca">
                  Hỗ trợ thông tin chính sách & nghiệp vụ ca
                </option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Phân loại nguyên nhân sự cố <span className="text-rose-500">*</span>
              </label>
              <select
                id="select-root-cause"
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg font-medium text-slate-800 focus:outline-none focus:border-[#20B9BE]"
              >
                <option value="Lỗi phần mềm trụ sạc (Firmware handshake timeout)">
                  Lỗi phần mềm trụ sạc (Firmware handshake timeout)
                </option>
                <option value="Khách hàng để quên đồ trên xe">
                  Khách hàng để quên đồ trên xe
                </option>
                <option value="Va chạm giao thông mức độ nhẹ (Vỏ nhựa cản sau)">
                  Va chạm giao thông mức độ nhẹ
                </option>
                <option value="Nghẽn trạm thu phát sóng di động BTS khu vực cầu">
                  Nghẽn trạm thu phát sóng di động BTS
                </option>
                <option value="Thắc mắc chính sách doanh thu & đối soát">
                  Thắc mắc chính sách doanh thu & đối soát
                </option>
              </select>
            </div>
          </div>

          {/* Internal Operator Notes */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Ghi chú nghiệp vụ ca trực (Nội bộ GSM)
            </label>
            <textarea
              id="textarea-internal-note"
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              rows={2}
              className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#20B9BE] leading-relaxed"
            />
          </div>

          {/* Driver Notification SMS/App message */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-700">
                Tin nhắn thông báo tự động gửi tới App GSM Driver của tài xế
              </label>
              <button
                onClick={handleInsertMacro}
                className="text-[11px] font-semibold text-[#008284] hover:underline"
              >
                Chèn macro mẫu
              </button>
            </div>
            <input
              id="input-driver-message"
              type="text"
              value={driverMessage}
              onChange={(e) => setDriverMessage(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-[#20B9BE]"
            />
          </div>

          {/* Checkbox Options */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoVoucher}
                onChange={(e) => setAutoVoucher(e.target.checked)}
                className="w-4 h-4 text-[#20B9BE] rounded border-slate-300 focus:ring-[#20B9BE]"
              />
              <span className="font-semibold text-slate-700">
                Tự động giải ngân Voucher 50.000đ vào ví tài xế
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={reportVGreen}
                onChange={(e) => setReportVGreen(e.target.checked)}
                className="w-4 h-4 text-[#20B9BE] rounded border-slate-300 focus:ring-[#20B9BE]"
              />
              <span className="font-semibold text-slate-700">
                Gửi báo cáo lỗi sang Kỹ thuật trạm V-GREEN
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <button
          id="btn-save-progress"
          onClick={handleSaveProgress}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shadow-2xs active:scale-98"
        >
          <Save className="w-3.5 h-3.5 text-slate-500" />
          <span>Lưu tiến độ & Tiếp tục theo dõi</span>
        </button>

        <button
          id="btn-complete-close-ticket"
          onClick={handleCompleteAndClose}
          className="flex items-center gap-1.5 px-5 py-2 bg-[#20B9BE] hover:bg-[#1ca5a9] text-white rounded-lg text-xs font-bold transition-all shadow-xs active:scale-98"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>Hoàn tất & Đóng Ticket</span>
        </button>
      </div>
    </div>
  );
};
