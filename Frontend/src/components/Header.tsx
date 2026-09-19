/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GreenSMLogo } from './GreenSMLogo';
import { 
  ChevronDown, 
  CheckCircle2, 
  LogOut,
  Settings,
  Coffee
} from 'lucide-react';
import { OperatorProfile, defaultOperatorProfile } from '../types';

interface HeaderProps {
  operatorProfile?: OperatorProfile;
  onUpdateOperatorStatus?: (status: 'online' | 'break' | 'busy') => void;
}

export const Header: React.FC<HeaderProps> = ({
  operatorProfile = defaultOperatorProfile,
  onUpdateOperatorStatus,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [operatorStatus, setOperatorStatus] = useState<'online' | 'break' | 'busy'>(operatorProfile.status);

  useEffect(() => {
    if (operatorProfile?.status) {
      setOperatorStatus(operatorProfile.status);
    }
  }, [operatorProfile?.status]);

  const handleStatusChange = (status: 'online' | 'break' | 'busy') => {
    setOperatorStatus(status);
    setShowProfileMenu(false);
    onUpdateOperatorStatus?.(status);
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Logo */}
      <div className="flex items-center">
        <GreenSMLogo />
      </div>

      {/* Right: Thông tin nhân viên (Nguyễn Mai Chi) */}
      <div className="relative">
        <button
          id="btn-profile-toggle"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
        >
          <div className="relative">
            <img
              src={operatorProfile.avatarUrl || '/avatar-chi.svg'}
              alt={operatorProfile.name}
              className="w-9 h-9 rounded-full object-cover border border-[#20B9BE]/40 shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
              operatorStatus === 'online' ? 'bg-emerald-500' : 
              operatorStatus === 'break' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></span>
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-900 leading-tight">
              {operatorProfile.name}
            </div>
            <div className="text-xs text-slate-500 font-medium leading-none mt-0.5">
              {operatorProfile.code} • {operatorProfile.shift}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </button>

        {/* Profile Dropdown */}
        {showProfileMenu && (
          <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-2.5 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900">{operatorProfile.name} ({operatorProfile.code})</p>
              <p className="text-xs text-slate-500 mt-0.5">{operatorProfile.role}</p>
              <p className="text-xs text-slate-400 mt-0.5">Thời gian: {operatorProfile.shiftTime}</p>
            </div>

            <div className="p-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2.5 py-1">Trạng thái ca trực</div>
              <button
                onClick={() => handleStatusChange('online')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-[#E3F8F8] hover:text-[#006768] rounded-lg cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  Sẵn sàng tiếp nhận
                </span>
                {operatorStatus === 'online' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </button>
              <button
                onClick={() => handleStatusChange('break')}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-500" />
                  Nghỉ giải lao (15p)
                </span>
                {operatorStatus === 'break' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
              </button>
            </div>

            <div className="border-t border-slate-100 p-1.5">
              <button 
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Cài đặt bàn điều phối
              </button>
              <button 
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                Bàn giao ca & Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

