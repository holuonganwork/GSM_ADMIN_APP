/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Fraud Investigation Sidebar (Collapsible)
 */

import React from 'react';
import { 
  ShieldAlert, 
  IdCard, 
  Scale, 
  Activity, 
  Coins,
  PanelLeftClose,
  PanelLeftOpen,
  History,
  Workflow
} from 'lucide-react';
import { ComplianceMetrics } from '../types';

export type NavTab = 'cases' | 'case_history' | 'driver_compliance' | 'fraud_analytics' | 'data_pipeline';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  caseCount?: number;
  pendingCount?: number;
  historyCount?: number;
  metrics?: ComplianceMetrics;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  caseCount = 0,
  pendingCount = 0,
  historyCount,
  metrics,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const processedCount = historyCount !== undefined ? historyCount : ((metrics?.exoneratedCount ?? 0) + (metrics?.penalizedCount ?? 0));

  const navItems = [
    {
      id: 'cases' as NavTab,
      label: 'Hồ Sơ Chờ Thẩm Định',
      shortLabel: 'Chờ duyệt',
      icon: ShieldAlert,
      badge: pendingCount > 0 ? pendingCount : undefined,
      badgeTitle: `${pendingCount} hồ sơ chờ duyệt`,
      countOnly: pendingCount,
      badgeHighlight: pendingCount > 0,
    },
    {
      id: 'case_history' as NavTab,
      label: 'Lịch Sử Phán Quyết & Xử Lý',
      shortLabel: 'Lịch sử',
      icon: History,
      badge: processedCount > 0 ? processedCount : undefined,
      badgeTitle: `${processedCount} hồ sơ đã hoàn tất`,
      countOnly: processedCount,
      badgeHighlight: false,
    },
    {
      id: 'driver_compliance' as NavTab,
      label: 'Hồ Sơ Tín Nhiệm & CCCD',
      shortLabel: 'Tài xế',
      icon: IdCard,
    },
    {
      id: 'fraud_analytics' as NavTab,
      label: 'Báo Cáo & Thống Kê Gian Lận',
      shortLabel: 'Báo cáo',
      icon: Scale,
    },
    {
      id: 'data_pipeline' as NavTab,
      label: 'Pipeline Dữ Liệu Lớn',
      shortLabel: 'Pipeline',
      icon: Workflow,
      badge: '100k',
      badgeTitle: '100.000 xe taxi điện VinFast đã chốt ca',
      countOnly: '100k',
      badgeHighlight: false,
    },
  ];

  return (
    <aside 
      id="sidebar-container"
      data-testid="sidebar-container"
      className={`${
        isCollapsed ? 'w-18' : 'w-72'
      } bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] select-none transition-all duration-300 relative overflow-hidden`}
    >
      {/* Top Section: Title & Navigation */}
      <div className={isCollapsed ? 'p-2 pt-3' : 'p-3'}>
        {/* Header label / Toggle button */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center mb-3' : 'justify-between px-1.5 py-1.5 mb-1'} text-[11px] font-bold text-slate-400 tracking-wider`}>
          {!isCollapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <img src="/greensm-mini-logo.png" alt="GSM" className="h-3.5 w-auto object-contain opacity-80 shrink-0" />
              <span className="uppercase font-mono text-slate-500 truncate">KIỂM SOÁT GSM</span>
            </div>
          )}
          
          {onToggleCollapse && (
            <button
              id="btn-toggle-sidebar"
              data-testid="btn-toggle-sidebar"
              onClick={onToggleCollapse}
              className={`${
                isCollapsed
                  ? 'w-11 h-11 mx-auto flex items-center justify-center rounded-xl hover:bg-slate-100'
                  : 'p-1.5 rounded-lg hover:bg-slate-100'
              } text-slate-500 hover:text-slate-800 transition-colors cursor-pointer shrink-0`}
              title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-[#008284]" />
              ) : (
                <PanelLeftClose className="w-4.5 h-4.5 text-slate-500 hover:text-[#008284]" />
              )}
            </button>
          )}
        </div>

        <nav className="space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <div key={item.id} className="relative group">
                <button
                  id={`sidebar-nav-${item.id}`}
                  data-testid={`sidebar-nav-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  title={item.label}
                  className={`${
                    isCollapsed 
                      ? 'w-11 h-11 mx-auto flex items-center justify-center p-0' 
                      : 'w-full flex items-center justify-between px-2.5 py-2.5'
                  } rounded-xl text-sm font-semibold transition-all cursor-pointer overflow-hidden relative ${
                    isActive
                      ? 'btn-gsm-primary'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {isCollapsed ? (
                    <>
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                      {item.badgeHighlight && (
                        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 border-2 border-white"></span>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate whitespace-nowrap text-[13px] font-semibold text-left">
                          {item.label}
                        </span>
                      </div>

                      {item.badge !== undefined && (
                        <span
                          title={item.badgeTitle}
                          className={`ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full shrink-0 ${
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
                    </>
                  )}
                </button>

                {/* Floating Tooltip when collapsed */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className="px-1.5 py-0.2 bg-amber-500 text-white text-[10px] rounded-full font-bold">
                        {item.countOnly}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Shift KPI Box */}
      <div className={isCollapsed ? 'p-2 border-t border-slate-200/80 bg-slate-50/50' : 'p-3 border-t border-slate-200/80 bg-slate-50/50'}>
        {!isCollapsed ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#20B9BE]" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  TIẾN ĐỘ THẨM ĐỊNH
                </span>
              </div>
              <span className="text-xs font-extrabold text-[#008284] bg-[#20B9BE]/10 px-2 py-0.5 rounded-md">
                {metrics?.slaCompliancePercent ? `${metrics.slaCompliancePercent}% SLA` : '100% SLA'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2.5">
              <div 
                className="bg-gradient-to-r from-[#28BDBF] to-[#209799] h-full rounded-full transition-all duration-500 shadow-2xs" 
                style={{ width: `${Math.min(100, Math.max(0, metrics?.slaCompliancePercent ?? 100))}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Đã phán quyết: <strong className="text-slate-900 font-bold">{processedCount}</strong></span>
              <span>Chờ duyệt: <strong className="text-amber-600 font-bold">{metrics?.pendingReview ?? 0}</strong></span>
            </div>

            {/* Fines recovered quick indicator */}
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-500" /> Tiền truy thu / phạt
              </span>
              <span className="text-emerald-700 font-bold font-mono text-xs">
                {metrics?.totalFinesRecovered ? `${(metrics.totalFinesRecovered / 1000000).toFixed(1)} Tr đ` : '0 đ'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-1 group relative">
            <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs cursor-pointer hover:border-[#20B9BE] hover:bg-slate-50 transition-colors">
              <Activity className="w-5 h-5 text-[#008284]" />
            </div>
            {/* Tooltip for mini KPI */}
            <div className="absolute left-full bottom-0 ml-3 px-3 py-2 bg-slate-900 text-white text-xs rounded-xl shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 space-y-1">
              <div className="font-bold text-[#20B9BE]">SLA: {metrics?.slaCompliancePercent}%</div>
              <div>Đã xử lý: {processedCount} • Chờ: {metrics?.pendingReview ?? 0}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
