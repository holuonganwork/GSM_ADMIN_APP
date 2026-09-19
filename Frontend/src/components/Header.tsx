/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { GreenSMLogo } from './GreenSMLogo';
import { 
  ChevronDown, 
  CheckCircle2, 
  LogOut,
  Settings,
  Coffee,
  Search,
  SlidersHorizontal,
  X,
  ShieldAlert,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { OperatorProfile, defaultOperatorProfile } from '../types';

interface HeaderProps {
  operatorProfile?: OperatorProfile;
  onUpdateOperatorStatus?: (status: 'online' | 'break' | 'busy') => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  selectedFraudType?: string;
  onFraudTypeChange?: (type: string) => void;
  selectedSeverity?: string;
  onSeverityChange?: (sev: string) => void;
  onSearchFocus?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  operatorProfile = defaultOperatorProfile,
  onUpdateOperatorStatus,
  searchQuery = '',
  onSearchChange,
  selectedFraudType = 'all',
  onFraudTypeChange,
  selectedSeverity = 'all',
  onSeverityChange,
  onSearchFocus,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [operatorStatus, setOperatorStatus] = useState<'online' | 'break' | 'busy'>(operatorProfile.status);

  const filterRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (operatorProfile?.status) {
      setOperatorStatus(operatorProfile.status);
    }
  }, [operatorProfile?.status]);

  // Click outside to close filter or profile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilterMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowFilterMenu(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleStatusChange = (status: 'online' | 'break' | 'busy') => {
    setOperatorStatus(status);
    setShowProfileMenu(false);
    onUpdateOperatorStatus?.(status);
  };

  const handleResetFilters = () => {
    onFraudTypeChange?.('all');
    onSeverityChange?.('all');
  };

  const activeFiltersCount = (selectedFraudType !== 'all' ? 1 : 0) + (selectedSeverity !== 'all' ? 1 : 0);

  const fraudTypeOptions = [
    { value: 'all', label: 'Tất cả loại vi phạm gian lận' },
    { value: 'cuoc_ao', label: 'Cuốc ảo / Chạy khống (Bonus hunting)' },
    { value: 'gps_spoofing', label: 'Giả lập vị trí GPS (Mock Location)' },
    { value: 'gian_lan_voucher', label: 'Trục lợi mã giảm giá Voucher' },
    { value: 'thu_cuoc_sai', label: 'Thu cước sai / Thu ngoài app' },
    { value: 'tat_dinh_vi', label: 'Ngắt kết nối T-Box Telematics' },
  ];

  const severityOptions = [
    { value: 'all', label: 'Tất cả mức độ nghiêm trọng', color: 'bg-slate-400' },
    { value: 'nghiem_trong', label: 'Nghiêm trọng (Cần đình chỉ)', color: 'bg-rose-500' },
    { value: 'trung_binh', label: 'Trung bình (Thẩm định biên bản)', color: 'bg-amber-500' },
    { value: 'nhe', label: 'Nhẹ (Xem xét nhắc nhở)', color: 'bg-sky-500' },
  ];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-30 shadow-xs gap-4">
      {/* Left: Logo */}
      <div className="flex items-center shrink-0">
        <GreenSMLogo />
      </div>

      {/* Center: Webmail-style Search Box with Filter Icon */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-6 relative" ref={filterRef}>
        <div className="relative flex items-center bg-slate-100/90 hover:bg-slate-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#008284]/20 focus-within:border-[#20B9BE] border border-slate-200/90 rounded-full h-10 px-3.5 transition-all shadow-2xs">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5 pointer-events-none" />
          <input
            id="header-case-search"
            data-testid="header-case-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onFocus={onSearchFocus}
            placeholder="Tìm mã hồ sơ, CCCD, tên tài xế, biển số xe..."
            className="flex-1 bg-transparent text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none min-w-0"
          />
          {searchQuery && (
            <button
              type="button"
              id="btn-header-search-clear"
              onClick={() => onSearchChange?.('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 cursor-pointer mr-1 transition-colors"
              title="Xóa từ khóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 mx-1"></div>

          {/* Filter Popover Toggle Button (Webmail style) */}
          <button
            type="button"
            id="btn-header-filter-toggle"
            data-testid="btn-header-filter-toggle"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className={`p-1.5 rounded-full transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
              activeFiltersCount > 0 || showFilterMenu
                ? 'bg-[#28BDBF]/15 text-[#006768] font-bold ring-1 ring-[#20B9BE]/50'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/70'
            }`}
            title="Tùy chọn bộ lọc nâng cao"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#008284] text-white text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Dropdown Popover */}
        {showFilterMenu && (
          <div className="absolute top-full mt-2 left-0 right-0 sm:right-auto sm:w-[480px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#008284]" />
                <span className="text-sm font-bold text-slate-900">Bộ lọc hồ sơ gian lận</span>
                {activeFiltersCount > 0 && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#E3F8F8] text-[#006768] rounded-full">
                    {activeFiltersCount} đang chọn
                  </span>
                )}
              </div>
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  id="btn-header-filter-reset"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Đặt lại
                </button>
              )}
            </div>

            {/* Filter Fields */}
            <div className="py-3.5 space-y-3.5">
              {/* Field 1: Loại vi phạm gian lận */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Loại hành vi gian lận
                </label>
                <div className="relative">
                  <select
                    id="filter-fraud-type-select"
                    data-testid="filter-fraud-type-select"
                    value={selectedFraudType}
                    onChange={(e) => onFraudTypeChange?.(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-[#20B9BE] rounded-xl text-xs font-medium text-slate-800 focus:outline-none cursor-pointer transition-colors"
                  >
                    {fraudTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Field 2: Mức độ nghiêm trọng */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  Mức độ nghiêm trọng
                </label>
                <div className="relative">
                  <select
                    id="filter-severity-select"
                    data-testid="filter-severity-select"
                    value={selectedSeverity}
                    onChange={(e) => onSeverityChange?.(e.target.value)}
                    className="w-full appearance-none pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 focus:border-[#20B9BE] rounded-xl text-xs font-medium text-slate-800 focus:outline-none cursor-pointer transition-colors"
                  >
                    {severityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Popover Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Tự động lọc danh sách theo tiêu chí
              </span>
              <button
                type="button"
                id="btn-header-filter-close"
                onClick={() => setShowFilterMenu(false)}
                className="px-3.5 py-1.5 btn-gsm-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Thông tin nhân viên (Nguyễn Mai Chi) */}
      <div className="relative shrink-0" ref={profileRef}>
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
          <div className="text-left hidden md:block">
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

