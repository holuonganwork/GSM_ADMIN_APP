/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GreenSMLogo } from './GreenSMLogo';
import { 
  Search, 
  PhoneCall, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  LogOut,
  Settings,
  Coffee
} from 'lucide-react';
import { AppNotification, OperatorProfile, defaultOperatorProfile } from '../types';

interface HeaderProps {
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onOpenSOS: () => void;
  onOpenNotifications?: () => void;
  operatorProfile?: OperatorProfile;
  notifications?: AppNotification[];
  onUpdateOperatorStatus?: (status: 'online' | 'break' | 'busy') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchChange,
  searchQuery,
  onOpenSOS,
  onOpenNotifications,
  operatorProfile = defaultOperatorProfile,
  notifications = [],
  onUpdateOperatorStatus,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [operatorStatus, setOperatorStatus] = useState<'online' | 'break' | 'busy'>(operatorProfile.status);
  const [showNotifications, setShowNotifications] = useState(false);

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
      {/* Left: Logo & Shift Info */}
      <div className="flex items-center gap-6">
        <GreenSMLogo />

        {/* Shift Badge & Online Status */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Ca: <strong className="text-slate-900 font-semibold">Sáng 07:00 - 15:00</strong></span>
          </div>
          <div className="w-[1px] h-3.5 bg-slate-300"></div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${
              operatorStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 
              operatorStatus === 'break' ? 'bg-amber-500' : 'bg-rose-500'
            }`}></span>
            <span className="text-slate-700 font-medium">
              {operatorStatus === 'online' ? 'Trực tuyến / Sẵn sàng' :
               operatorStatus === 'break' ? 'Nghỉ giải lao' : 'Bận cuộc gọi'}
            </span>
          </div>
        </div>
      </div>

      {/* Center/Right: Search, SOS Hotline, Notifications & Profile */}
      <div className="flex items-center gap-3.5">
        {/* Search Bar */}
        <div className="relative w-64 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="header-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm mã ticket, biển số"
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#20B9BE] rounded-lg text-xs md:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* SOS Hotline Button (Red button with star/phone icon as in Image 4) */}
        <button
          id="btn-sos-hotline"
          onClick={onOpenSOS}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors shadow-xs active:scale-98"
        >
          <span className="text-sm leading-none font-black">*</span>
          <PhoneCall className="w-3.5 h-3.5" />
          <span className="tracking-wide uppercase">SOS Hotline</span>
        </button>

        {/* Notifications Icon with Badge */}
        <div className="relative">
          <button
            id="btn-notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="Thông báo sự cố"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Cảnh báo ca trực ({notifications.length})
                </span>
                {notifications.length > 0 && (
                  <span className="text-[11px] text-[#20B9BE] font-medium cursor-pointer hover:underline">
                    Đánh dấu đã đọc
                  </span>
                )}
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs px-4">
                    Không có cảnh báo mới trong ca trực.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${
                            n.type === 'danger' ? 'bg-rose-500' :
                            n.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                          }`} />
                          <h4 className="text-xs font-semibold text-slate-800">{n.title}</h4>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 pl-3.5 leading-relaxed">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile matching Image 3 & Image 4 */}
        <div className="relative">
          <button
            id="btn-profile-toggle"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-1.5 pr-2 py-1 hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="relative">
              <img
                src={operatorProfile.avatarUrl || '/avatar-chi.svg'}
                alt={operatorProfile.name}
                className="w-8 h-8 rounded-full object-cover border border-[#20B9BE]/40 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full ${
                operatorStatus === 'online' ? 'bg-emerald-500' :
                operatorStatus === 'break' ? 'bg-amber-500' : 'bg-rose-500'
              }`}></span>
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {operatorProfile.name}
              </div>
              <div className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                {operatorProfile.code} • {operatorProfile.shift}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{operatorProfile.name} ({operatorProfile.code})</p>
                <p className="text-[11px] text-slate-500">{operatorProfile.role}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Thời gian: {operatorProfile.shiftTime}</p>
              </div>

              <div className="p-1.5">
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">Trạng thái ca trực</div>
                <button
                  onClick={() => handleStatusChange('online')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Sẵn sàng tiếp nhận
                  </span>
                  {operatorStatus === 'online' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
                <button
                  onClick={() => handleStatusChange('break')}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-700 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <Coffee className="w-3.5 h-3.5 text-amber-500" />
                    Nghỉ giải lao (15p)
                  </span>
                  {operatorStatus === 'break' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              </div>

              <div className="border-t border-slate-100 p-1.5">
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Cài đặt bàn điều phối
                </button>
                <button 
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  Bàn giao ca & Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
