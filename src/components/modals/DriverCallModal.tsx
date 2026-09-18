/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Volume2, UserCheck, X } from 'lucide-react';

interface DriverCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
  driverPhone: string;
}

export const DriverCallModal: React.FC<DriverCallModalProps> = ({
  isOpen,
  onClose,
  driverName,
  driverPhone,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [callStatus, setCallStatus] = useState<'calling' | 'connected'>('calling');

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus('calling');
      return;
    }

    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 1500);

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
        {/* Close */}
        <div className="flex justify-end">
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver Avatar */}
        <div className="mx-auto w-20 h-20 rounded-full bg-[#20B9BE]/20 border-2 border-[#20B9BE] flex items-center justify-center text-2xl font-bold text-[#20B9BE] my-4 relative">
          {driverName.slice(0, 2).toUpperCase()}
          {callStatus === 'connected' && (
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
          )}
        </div>

        {/* Name & Phone */}
        <h3 className="text-lg font-bold text-white tracking-tight">{driverName}</h3>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{driverPhone}</p>

        {/* Status */}
        <div className="my-4">
          {callStatus === 'calling' ? (
            <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-semibold rounded-full animate-pulse">
              Đang đổ chuông kết nối...
            </span>
          ) : (
            <div className="space-y-1">
              <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full">
                Đã kết nối qua kênh GSM Voice
              </span>
              <p className="text-xl font-mono font-bold text-white tracking-wider">
                {formatTimer(callDuration)}
              </p>
            </div>
          )}
        </div>

        {/* Audio Waveform simulation */}
        {callStatus === 'connected' && (
          <div className="flex items-center justify-center gap-1 my-3 h-8">
            {[40, 70, 30, 90, 60, 100, 50, 80, 45, 65, 30].map((h, i) => (
              <div
                key={i}
                className="w-1 bg-[#20B9BE] rounded-full animate-pulse"
                style={{
                  height: `${h}%`,
                  animationDuration: `${0.4 + (i % 4) * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Action controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3.5 rounded-full border transition-colors ${
              isMuted
                ? 'bg-rose-500 text-white border-rose-600'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Bật micro' : 'Tắt micro'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={onClose}
            className="p-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg transition-transform active:scale-95"
            title="Kết thúc cuộc gọi"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            className="p-3.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 rounded-full transition-colors"
            title="Loa ngoài"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
