/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, PhoneCall, ShieldAlert, Flame, HeartPulse, Shield, Wrench } from 'lucide-react';

interface SOSHotlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SOSHotlineModal: React.FC<SOSHotlineModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const hotlines = [
    {
      title: 'Hotline Khẩn Cấp GSM (Ưu tiên P1)',
      number: '1900 2088 - Nhánh 1',
      desc: 'Dành riêng cho điều phối viên và tài xế gặp sự cố cháy nổ, va chạm nặng hoặc đe doạ an toàn.',
      color: 'bg-rose-50 border-rose-200 text-rose-700',
      icon: ShieldAlert,
    },
    {
      title: 'Đội Cơ Động Phản Ứng Nhanh (Mobile Unit)',
      number: '024.7300.2288',
      desc: 'Điều xe cứu hộ cẩu kéo VinFast, xe sạc di động khẩn cấp và cán bộ pháp lý hiện trường.',
      color: 'bg-amber-50 border-amber-200 text-amber-700',
      icon: Shield,
    },
    {
      title: 'Tổng Đài Kỹ Thuật Trạm Sạc V-GREEN',
      number: '1900 633 633',
      desc: 'Xử lý trụ sạc quá nhiệt, kẹt cáp sạc cơ học, mất điện lưới trạm và lỗi firmware trụ.',
      color: 'bg-cyan-50 border-cyan-200 text-cyan-800',
      icon: Wrench,
    },
    {
      title: 'Cứu Nạn Cứu Hộ & Cảnh Sát PCCC (114)',
      number: '114',
      desc: 'Quy trình ứng phó pin xe điện theo tiêu chuẩn an toàn PCCC Bộ Công An.',
      color: 'bg-red-50 border-red-200 text-red-700',
      icon: Flame,
    },
    {
      title: 'Cấp Cứu Y Tế 115',
      number: '115',
      desc: 'Hỗ trợ y tế khẩn cấp cho hành khách và tài xế.',
      color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      icon: HeartPulse,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
            <div>
              <h3 className="text-sm font-bold tracking-tight">KÊNH LIÊN LẠC KHẨN CẤP GSM SOS HOTLINE</h3>
              <p className="text-[11px] text-rose-100">Bàn điều phối trực 24/7 kết nối các lực lượng phản ứng nhanh</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white/80 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hotlines */}
        <div className="p-4 space-y-2.5 max-h-[420px] overflow-y-auto">
          {hotlines.map((h, i) => {
            const Icon = h.icon;
            return (
              <div
                key={i}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${h.color}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-lg bg-white shadow-2xs shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{h.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{h.desc}</p>
                    <div className="text-xs font-black font-mono mt-1 text-slate-900 tracking-wide">
                      {h.number}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${h.number.split(' ')[0]}`}
                  className="px-3 py-1.5 bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 font-bold text-xs rounded-lg shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  Gọi ngay
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
