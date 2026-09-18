/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, RotateCw, CheckCircle2, Zap, Radio, ShieldAlert } from 'lucide-react';

interface ResetStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  stationId: string;
}

export const ResetStationModal: React.FC<ResetStationModalProps> = ({
  isOpen,
  onClose,
  stationId,
}) => {
  const [resetState, setResetState] = useState<'idle' | 'sending' | 'success'>('idle');

  if (!isOpen) return null;

  const handleStartReset = () => {
    setResetState('sending');
    setTimeout(() => {
      setResetState('success');
    }, 2000);
  };

  const handleDone = () => {
    setResetState('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-5 text-center">
        {/* Header */}
        <div className="flex justify-end">
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Icon & Status */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#20B9BE] my-3">
          {resetState === 'sending' ? (
            <RotateCw className="w-8 h-8 animate-spin text-[#008284]" />
          ) : resetState === 'success' ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          ) : (
            <Radio className="w-8 h-8 text-[#20B9BE]" />
          )}
        </div>

        <h3 className="text-sm font-bold text-slate-900">
          {resetState === 'success'
            ? 'Đã Reset Trụ Sạc Thành Công'
            : resetState === 'sending'
            ? 'Đang phát xung điều khiển...'
            : 'Reset Trụ Sạc V-GREEN Từ Xa'}
        </h3>

        <p className="text-xs text-slate-500 font-mono mt-1">
          Mã định danh trụ: <strong className="text-slate-800 font-bold">{stationId}</strong>
        </p>

        <p className="text-xs text-slate-600 leading-relaxed mt-2.5 px-2">
          {resetState === 'success'
            ? 'Hệ thống hạ tầng V-GREEN đã nhả chốt cơ học và khởi động lại bo mạch sạc CCS2 60kW thành công.'
            : resetState === 'sending'
            ? 'Đang gửi giao thức PLC/CAN Bus tới trụ sạc qua hạ tầng IoT GSM...'
            : 'Lệnh này sẽ ngắt dòng bảo vệ, reset mạch khoá solenoid và cho phép rút súng sạc an toàn.'}
        </p>

        {/* Action Button */}
        <div className="mt-5">
          {resetState === 'idle' && (
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleStartReset}
                className="flex-1 py-2 text-xs font-bold text-white bg-[#008284] hover:bg-[#006f71] rounded-lg shadow-xs"
              >
                Phát lệnh Reset
              </button>
            </div>
          )}

          {resetState === 'sending' && (
            <div className="py-2 text-xs font-semibold text-slate-500 animate-pulse">
              Vui lòng đợi trong giây lát...
            </div>
          )}

          {resetState === 'success' && (
            <button
              onClick={handleDone}
              className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
            >
              Hoàn tất & Đóng
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
