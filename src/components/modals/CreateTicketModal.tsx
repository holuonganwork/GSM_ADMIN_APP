/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Car, AlertTriangle, User, Phone } from 'lucide-react';
import { Ticket, TicketPriority } from '../../types';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTicket: Ticket) => void;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [model, setModel] = useState('VinFast VF 5 Plus');
  const [batterySoC, setBatterySoC] = useState(35);
  const [priority, setPriority] = useState<TicketPriority>('P1');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !driverName.trim()) return;

    const initials = driverName
      .split(' ')
      .map((n) => n[0])
      .slice(-2)
      .join('')
      .toUpperCase();

    const newTicket: Ticket = {
      id: `TK-${Math.floor(8850 + Math.random() * 50)}`,
      priority,
      priorityLabel: priority === 'P1' ? 'P1 Khẩn cấp' : priority === 'P2' ? 'P2 Cao' : 'P3 Bình thường',
      title: title.trim(),
      description: description.trim() || 'Sự cố phát sinh trong ca làm việc, đang được điều phối viên ghi nhận.',
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' (Hôm nay)',
      timeAgo: 'Vừa xong',
      slaDeadline: '15:00',
      slaRemainingSeconds: priority === 'P1' ? 900 : 1800,
      driver: {
        name: driverName.trim(),
        phone: driverPhone.trim() || '0901.888.999',
        initials: initials || 'TX',
        rating: 4.95,
      },
      vehicle: {
        model,
        plate: plate.trim() || '29E-888.99',
        batterySoC,
        estimatedKm: Math.round(batterySoC * 3.5),
        status: 'Đang online (Standby)',
        bmsCode: 'NORMAL_OPERATION',
        location: 'Hà Nội',
        speed: 0,
      },
      status: 'cho_tiep_nhan',
      statusLabel: 'Chờ tiếp nhận',
      coordinator: 'Nguyễn Mai Chi',
      aiRecommendation: {
        confidence: 94,
        text: 'Đã phân loại sự cố tự động qua GSM Dispatch Core. Đề xuất liên hệ trực tiếp tài xế qua kênh thoại để đối chiếu hiện trạng xe.',
        actionText: 'Kết nối thoại với tài xế ngay',
        subActionText: 'Kiểm tra lịch sử bảo dưỡng xe trên VinFast Aftersales',
      },
      history: [
        {
          id: `h-${Date.now()}`,
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          source: 'Điều phối viên Nguyễn Mai Chi',
          badge: 'Tạo ticket thủ công',
          badgeType: 'agent',
          text: `Khởi tạo ticket khẩn cấp cho xe ${plate || 'mới'}.`,
        },
      ],
      resolution: {
        action: 'Tiếp nhận thông tin và phân luồng xử lý',
        rootCause: 'Sự cố đang điều tra nguyên nhân',
        internalNote: 'Đã ghi nhận yêu cầu từ tài xế trong ca sáng.',
        driverMessage: 'Green SM: Tổng đài đã tiếp nhận yêu cầu hỗ trợ và đang phối hợp xử lý cho Bác tài.',
        autoVoucher: false,
        reportVGreen: false,
        authorityLevel: 'Cấp 1 Được phép Đóng',
      },
    };

    onSubmit(newTicket);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#20B9BE]/15 text-[#008284] flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tạo Ticket Hỗ Trợ GSM Mới</h3>
              <p className="text-[11px] text-slate-500">Phân luồng sự cố xe điện và điều phối xử lý tức thì</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1">
          {/* Priority selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mức độ ưu tiên *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['P1', 'P2', 'P3'] as TicketPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                    priority === p
                      ? p === 'P1' ? 'bg-rose-500 text-white border-rose-600' :
                        p === 'P2' ? 'bg-amber-500 text-white border-amber-600' :
                        'bg-sky-500 text-white border-sky-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p === 'P1' ? 'P1 Khẩn cấp' : p === 'P2' ? 'P2 Cao' : 'P3 Tiêu chuẩn'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề sự cố *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Xe báo lỗi súng sạc DC không nhả chốt..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#20B9BE]"
            />
          </div>

          {/* Vehicle & Plate */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dòng xe VinFast *</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#20B9BE]"
              >
                <option value="VinFast VF e34">VinFast VF e34</option>
                <option value="VinFast VF 5 Plus">VinFast VF 5 Plus</option>
                <option value="VinFast VF 6">VinFast VF 6</option>
                <option value="VinFast VF 7">VinFast VF 7</option>
                <option value="VinFast VF 8">VinFast VF 8</option>
                <option value="VinFast VF 9">VinFast VF 9</option>
                <option value="VinFast VF 3">VinFast VF 3</option>
                <option value="VinFast Feliz S">VinFast Feliz S (GreenBike)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Biển kiểm soát *</label>
              <input
                type="text"
                required
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                placeholder="VD: 29E-521.84"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono font-semibold focus:outline-none focus:border-[#20B9BE]"
              />
            </div>
          </div>

          {/* Driver details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên Bác tài *</label>
              <input
                type="text"
                required
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="VD: Lê Hoàng Long"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#20B9BE]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
              <input
                type="text"
                required
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="VD: 0912.345.678"
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#20B9BE]"
              />
            </div>
          </div>

          {/* Battery SoC */}
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Mức pin xe (SoC): {batterySoC}%</span>
              <span className={batterySoC < 15 ? 'text-rose-600' : 'text-emerald-600'}>
                {batterySoC < 15 ? 'Pin yếu khẩn cấp' : 'Bình thường'}
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="100"
              value={batterySoC}
              onChange={(e) => setBatterySoC(Number(e.target.value))}
              className="w-full accent-[#20B9BE]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả hiện trạng sự cố</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Chi tiết phản ánh từ tài xế hoặc cảnh báo telemetry tự động..."
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#20B9BE]"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#008284] hover:bg-[#006f71] text-white text-xs font-bold rounded-lg shadow-xs active:scale-98"
            >
              Khởi tạo Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
