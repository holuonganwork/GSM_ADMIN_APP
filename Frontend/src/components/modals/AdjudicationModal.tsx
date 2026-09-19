/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Adjudication Decision Modal (Quyết định xử phạt hoặc tha lỗi)
 */

import React, { useState } from 'react';
import { X, Gavel, CheckCircle2, AlertTriangle, HelpCircle, ShieldCheck, ShieldAlert, FileText, Send } from 'lucide-react';
import { FraudCase, DecisionType } from '../../types';

interface AdjudicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: FraudCase;
  initialType: DecisionType;
  onSubmitDecision: (decisionData: {
    decisionType: DecisionType;
    fineAmount?: number;
    suspensionDays?: number;
    reason: string;
    messageToDriver: string;
  }) => void;
}

export const AdjudicationModal: React.FC<AdjudicationModalProps> = ({
  isOpen,
  onClose,
  caseItem,
  initialType,
  onSubmitDecision,
}) => {
  if (!isOpen) return null;

  const [decisionType, setDecisionType] = useState<DecisionType>(initialType);
  const [fineAmount, setFineAmount] = useState<number>(
    initialType === 'xu_phat_tien' 
      ? (caseItem.evidence.bonusClaimed > 0 ? caseItem.evidence.bonusClaimed + 500000 : 500000) 
      : 0
  );
  const [suspensionDays, setSuspensionDays] = useState<number>(initialType === 'tam_khoa' ? 7 : 0);
  const [reason, setReason] = useState<string>(() => {
    if (initialType === 'tha_loi') {
      return 'Chấp nhận lời giải trình của tài xế. Sự việc phát sinh do nguyên nhân khách quan hoặc lỗi hệ thống, không có dấu hiệu cố ý trục lợi.';
    }
    if (initialType === 'canh_cao') {
      return 'Nhắc nhở tài xế tuân thủ nghiêm ngặt quy chế vận hành GSM. Vi phạm lần đầu mức độ nhẹ.';
    }
    if (initialType === 'yeu_cau_bo_sung') {
      return 'Lời giải trình chưa đủ căn cứ xác thực. Yêu cầu tài xế chụp ảnh vé cầu đường / biên nhận đối soát trong vòng 24h.';
    }
    return `Xử phạt hành vi ${caseItem.fraudTypeLabel} theo Quy chế Thưởng & Tuân thủ dịch vụ GSM.`;
  });

  const [messageToDriver, setMessageToDriver] = useState<string>(() => {
    if (initialType === 'tha_loi') {
      return `Kính gửi Bác tài ${caseItem.driver.name} (CCCD: ${caseItem.driver.cccd}), Ban Kiểm soát GSM đã phê duyệt biên bản giải trình của bạn cho hồ sơ #${caseItem.id}. Bạn được miễn xử phạt và bảo lưu toàn bộ điểm tín nhiệm. Chúc bạn vạn dặm bình an!`;
    }
    if (initialType === 'canh_cao') {
      return `Kính gửi Bác tài ${caseItem.driver.name}, Ban Kiểm soát GSM nhắc nhở bạn cần tuân thủ quy chuẩn dịch vụ. Lần sau nếu tái phạm sẽ áp dụng khung xử phạt tài chính.`;
    }
    if (initialType === 'yeu_cau_bo_sung') {
      return `Kính gửi Bác tài ${caseItem.driver.name}, biên bản giải trình của bạn cần bổ sung thêm hóa đơn / bằng chứng trong 24h để Ban kiểm soát xem xét.`;
    }
    return `Quyết định xử lý hồ sơ #${caseItem.id}: Áp dụng hình thức xử phạt theo quy chế vi phạm ${caseItem.fraudTypeLabel}. Số tiền phạt sẽ được cấn trừ vào ví tài xế.`;
  });

  const handleTypeChange = (type: DecisionType) => {
    setDecisionType(type);
    if (type === 'tha_loi') {
      setFineAmount(0);
      setSuspensionDays(0);
      setReason('Chấp nhận lời giải trình của tài xế. Sự việc phát sinh do nguyên nhân khách quan, không phát hiện dấu hiệu cố ý trục lợi.');
      setMessageToDriver(`Kính gửi Bác tài ${caseItem.driver.name} (CCCD: ${caseItem.driver.cccd}), Ban Kiểm soát GSM đã phê duyệt biên bản giải trình của bạn cho hồ sơ #${caseItem.id}. Bạn được miễn xử phạt và bảo lưu điểm uy tín.`);
    } else if (type === 'canh_cao') {
      setFineAmount(0);
      setSuspensionDays(0);
      setReason('Nhắc nhở tài xế tuân thủ quy chế vận hành GSM. Vi phạm lần đầu mức độ nhẹ.');
      setMessageToDriver(`Kính gửi Bác tài ${caseItem.driver.name}, bạn nhận cảnh cáo nhắc nhở về hành vi ${caseItem.fraudTypeLabel}. Vui lòng không tái phạm.`);
    } else if (type === 'yeu_cau_bo_sung') {
      setFineAmount(0);
      setSuspensionDays(0);
      setReason('Cần bổ sung chứng cứ xác minh chuyến đi.');
      setMessageToDriver(`Kính gửi Bác tài ${caseItem.driver.name}, vui lòng tải lên thêm ảnh biên nhận / hình ảnh đối soát trong 24 giờ.`);
    } else if (type === 'xu_phat_tien') {
      setFineAmount(500000);
      setSuspensionDays(0);
      setReason(`Xử phạt hành vi ${caseItem.fraudTypeLabel} theo Quy chế Tuân thủ GSM.`);
      setMessageToDriver(`Quyết định xử phạt hồ sơ #${caseItem.id}: Phạt tiền 500.000 VNĐ khấu trừ ví hoạt động.`);
    } else if (type === 'tam_khoa') {
      setFineAmount(1000000);
      setSuspensionDays(7);
      setReason(`Tạm khóa tài khoản 7 ngày do vi phạm nghiêm trọng quy chuẩn ${caseItem.fraudTypeLabel}.`);
      setMessageToDriver(`Quyết định xử phạt: Phạt 1.000.000 VNĐ và tạm khóa tài khoản 7 ngày.`);
    } else if (type === 'khoa_vinh_vien') {
      setFineAmount(2000000);
      setSuspensionDays(999);
      setReason(`Khóa vĩnh viễn và chấm dứt hợp tác do gian lận có tổ chức hoặc tái phạm nhiều lần.`);
      setMessageToDriver(`Quyết định kỷ luật: Chấm dứt hợp tác và khóa vĩnh viễn tài khoản tài xế GSM.`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitDecision({
      decisionType,
      fineAmount: decisionType === 'xu_phat_tien' || decisionType === 'tam_khoa' || decisionType === 'khoa_vinh_vien' ? fineAmount : undefined,
      suspensionDays: decisionType === 'tam_khoa' ? suspensionDays : (decisionType === 'khoa_vinh_vien' ? 999 : undefined),
      reason,
      messageToDriver,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              decisionType === 'tha_loi' ? 'bg-emerald-100 text-emerald-700' :
              decisionType === 'canh_cao' ? 'bg-amber-100 text-amber-800' :
              decisionType === 'yeu_cau_bo_sung' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'
            }`}>
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Ra Phán Quyết Xử Lý Hồ Sơ #{caseItem.id}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Tài xế: <strong className="text-slate-800">{caseItem.driver.name}</strong> • CCCD: <strong className="text-slate-800">{caseItem.driver.cccd}</strong>
              </p>
            </div>
          </div>
          <button
            id="btn-modal-close"
            data-testid="btn-modal-close"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* Action Decision Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-2 uppercase text-[11px] tracking-wide">
              Hình Thức Phán Quyết
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                id="btn-decision-tha-loi"
                data-testid="btn-decision-tha-loi"
                onClick={() => handleTypeChange('tha_loi')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  decisionType === 'tha_loi'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-emerald-700">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Tha lỗi / Minh oan</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Chấp nhận giải trình</span>
              </button>

              <button
                type="button"
                id="btn-decision-canh-cao"
                data-testid="btn-decision-canh-cao"
                onClick={() => handleTypeChange('canh_cao')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  decisionType === 'canh_cao'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-amber-700">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Cảnh cáo</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Nhắc nhở không phạt</span>
              </button>

              <button
                type="button"
                id="btn-decision-yeu-cau-bo-sung"
                data-testid="btn-decision-yeu-cau-bo-sung"
                onClick={() => handleTypeChange('yeu_cau_bo_sung')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  decisionType === 'yeu_cau_bo_sung'
                    ? 'border-sky-500 bg-sky-50/70 text-sky-900 ring-2 ring-sky-500/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-sky-700">
                  <FileText className="w-4 h-4" />
                  <span>Yêu cầu thêm</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Bổ sung trong 24h</span>
              </button>

              <button
                type="button"
                id="btn-decision-xu-phat-tien"
                data-testid="btn-decision-xu-phat-tien"
                onClick={() => handleTypeChange('xu_phat_tien')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  decisionType === 'xu_phat_tien'
                    ? 'border-rose-500 bg-rose-50/70 text-rose-900 ring-2 ring-rose-500/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-rose-700">
                  <Gavel className="w-4 h-4" />
                  <span>Phạt tiền ví</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Truy thu & trừ tiền</span>
              </button>

              <button
                type="button"
                id="btn-decision-tam-khoa"
                data-testid="btn-decision-tam-khoa"
                onClick={() => handleTypeChange('tam_khoa')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  decisionType === 'tam_khoa'
                    ? 'border-rose-600 bg-rose-50/80 text-rose-900 ring-2 ring-rose-600/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-rose-800">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Tạm khóa app</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Đình chỉ 3 - 30 ngày</span>
              </button>

              <button
                type="button"
                id="btn-decision-khoa-vinh-vien"
                data-testid="btn-decision-khoa-vinh-vien"
                onClick={() => handleTypeChange('khoa_vinh_vien')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                  decisionType === 'khoa_vinh_vien'
                    ? 'border-red-800 bg-red-100 text-red-950 ring-2 ring-red-800/20 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 text-red-900 font-bold">
                  <X className="w-4 h-4" />
                  <span>Khóa vĩnh viễn</span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">Chấm dứt hợp tác</span>
              </button>
            </div>
          </div>

          {/* Conditional Penalty Controls */}
          {(decisionType === 'xu_phat_tien' || decisionType === 'tam_khoa' || decisionType === 'khoa_vinh_vien') && (
            <div className="bg-rose-50/50 border border-rose-200/80 rounded-xl p-3.5 space-y-3">
              <div className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5 text-rose-600" />
                Định mức chế tài tài chính & kỷ luật
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Số tiền phạt / Truy thu (VNĐ):</label>
                  <input
                    type="number"
                    id="input-fine-amount"
                    data-testid="input-fine-amount"
                    step="50000"
                    value={fineAmount}
                    onChange={(e) => setFineAmount(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs font-mono font-bold text-rose-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    = {fineAmount.toLocaleString('vi-VN')} VNĐ
                  </p>
                </div>

                {decisionType === 'tam_khoa' && (
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Thời hạn tạm khóa tài khoản:</label>
                    <select
                      id="select-suspension-days"
                      data-testid="select-suspension-days"
                      value={suspensionDays}
                      onChange={(e) => setSuspensionDays(Number(e.target.value))}
                      className="w-full p-2 bg-white border border-rose-300 rounded-lg text-xs font-semibold text-slate-800"
                    >
                      <option value={3}>Tạm khóa 3 ngày</option>
                      <option value={7}>Tạm khóa 7 ngày</option>
                      <option value={14}>Tạm khóa 14 ngày</option>
                      <option value={30}>Tạm khóa 30 ngày (Đào tạo lại)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Căn Cứ Pháp Lý & Điều Khoản Quy Chế GSM:
            </label>
            <textarea
              id="textarea-decision-reason"
              data-testid="textarea-decision-reason"
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#20B9BE]"
              placeholder="Nhập căn cứ điều lệ..."
            />
          </div>

          {/* Message to Driver */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Thông Điệp Gửi Về Ứng Dụng GSM Driver Của Tài Xế:</span>
              <span className="text-[10px] text-emerald-600 font-normal">Tự động đẩy qua push notification</span>
            </label>
            <textarea
              id="textarea-decision-message"
              data-testid="textarea-decision-message"
              rows={3}
              value={messageToDriver}
              onChange={(e) => setMessageToDriver(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#20B9BE] font-sans"
              placeholder="Nhập nội dung thông báo gửi tài xế..."
            />
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-3.5 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              id="btn-modal-cancel"
              data-testid="btn-modal-cancel"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm cursor-pointer transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              id="btn-modal-submit"
              data-testid="btn-modal-submit"
              className={`px-6 py-2.5 font-bold rounded-xl text-sm text-white flex items-center gap-2 shadow-xs cursor-pointer transition-colors active:scale-[0.98] ${
                decisionType === 'tha_loi'
                  ? 'btn-gsm-success'
                  : decisionType === 'canh_cao'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : decisionType === 'yeu_cau_bo_sung'
                  ? 'bg-sky-600 hover:bg-sky-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              <Send className="w-4.5 h-4.5" />
              {decisionType === 'tha_loi' ? 'Xác Nhận Tha Lỗi & Minh Oan' :
               decisionType === 'canh_cao' ? 'Ban Hành Cảnh Cáo' :
               decisionType === 'yeu_cau_bo_sung' ? 'Gửi Yêu Cầu Bổ Sung' : 'Ban Hành Quyết Định Xử Phạt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
