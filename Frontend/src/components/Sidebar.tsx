/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fraud Investigation Sidebar
 */

import React from 'react';
import { 
  ShieldAlert, 
  IdCard, 
  Scale, 
  Activity, 
  Gavel, 
  CheckCircle2, 
  Coins 
} from 'lucide-react';
import { ComplianceMetrics } from '../types';

export type NavTab = 'cases' | 'driver_compliance' | 'fraud_analytics';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  caseCount?: number;
  pendingCount?: number;
  metrics?: ComplianceMetrics;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  caseCount = 0,
  pendingCount = 0,
  metrics,
}) => {
  const navItems = [
    {
      id: 'cases' as NavTab,
      label: 'Hồ Sơ Gian Lận & Giải Trình',
      icon: ShieldAlert,
      badge: pendingCount > 0 ? `${pendingCount} chờ duyệt` : caseCount,
      badgeHighlight: pendingCount > 0,
    },
    {
      id: 'driver_compliance' as NavTab,
      label: 'Hồ Sơ Tín Nhiệm & CCCD Tài Xế',
      icon: IdCard,
    },
    {
      id: 'fraud_analytics' as NavTab,
      label: 'Báo Cáo & Thống Kê Gian Lận',
      icon: Scale,
    },
  ];

  const processedCount = (metrics?.exoneratedCount ?? 0) + (metrics?.penalizedCount ?? 0);

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top Section: Title & Navigation */}
      <div className="p-3">
        {/* Header label */}
        <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          <img src="/greensm-mini-logo.png" alt="GSM" className="h-3.5 w-auto object-contain opacity-80" />
          <span>KIỂM SOÁT TUÂN THỦ GSM</span>
        </div>

        <nav className="space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'btn-gsm-primary'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeHighlight
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-[#20B9BE]/15 text-[#006768]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Shift KPI Box */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#20B9BE]" />
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                TIẾN ĐỘ THẨM ĐỊNH
              </span>
            </div>
            <span className="text-xs font-extrabold text-[#008284] bg-[#20B9BE]/10 px-1.5 py-0.5 rounded">
              {metrics?.slaCompliancePercent ? `${metrics.slaCompliancePercent}% SLA` : '100% SLA'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2.5">
            <div 
              className="bg-gradient-to-r from-[#28BDBF] to-[#209799] h-full rounded-full transition-all duration-500 shadow-2xs" 
              style={{ width: `${Math.min(100, Math.max(0, metrics?.slaCompliancePercent ?? 100))}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Đã phán quyết: <strong className="text-slate-900 font-bold">{processedCount}</strong></span>
            <span>Chờ duyệt: <strong className="text-amber-600 font-bold">{metrics?.pendingReview ?? 0}</strong></span>
          </div>
        </div>

        {/* Fines recovered quick indicator */}
        <div className="mt-2.5 px-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Coins className="w-3 h-3 text-amber-500" /> Tiền truy thu / phạt
          </span>
          <span className="text-emerald-700 font-bold font-mono">
            {metrics?.totalFinesRecovered ? `${(metrics.totalFinesRecovered / 1000000).toFixed(1)} Tr đ` : '0 đ'}
          </span>
        </div>
      </div>
    </aside>
  );
};
