/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TicketCheck, 
  MessageSquare, 
  MapPin, 
  UserCheck, 
  BarChart3, 
  Activity,
  Zap,
  TrendingUp
} from 'lucide-react';

import { ShiftMetrics } from '../types';

export type NavTab = 'tickets' | 'driver_chat' | 'fleet_map' | 'driver_management' | 'sla_reports';

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  ticketCount?: number;
  chatCount?: number;
  metrics?: ShiftMetrics;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  ticketCount = 0,
  chatCount = 0,
  metrics,
}) => {
  const navItems = [
    {
      id: 'tickets' as NavTab,
      label: 'Xử lý Ticket',
      icon: TicketCheck,
      badge: ticketCount,
    },
    {
      id: 'driver_chat' as NavTab,
      label: 'Chat với Tài xế',
      icon: MessageSquare,
      badge: chatCount,
    },
    {
      id: 'fleet_map' as NavTab,
      label: 'Bản đồ Đội xe & Điểm sạc',
      icon: MapPin,
    },
    {
      id: 'driver_management' as NavTab,
      label: 'Quản lý Tài xế',
      icon: UserCheck,
    },
    {
      id: 'sla_reports' as NavTab,
      label: 'Báo cáo & Thống kê SLA',
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-[calc(100vh-3.5rem)] select-none">
      {/* Top Section: Title & Navigation */}
      <div className="p-3">
        {/* Header label matching Image 4: "KÊNH VẬN HÀNH GSM" */}
        <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
          <img src="/greensm-mini-logo.png" alt="GSM" className="h-3.5 w-auto object-contain opacity-80" />
          <span>KÊNH VẬN HÀNH GSM</span>
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#008284] text-white shadow-xs'
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

      {/* Bottom Shift KPI Box matching Image 4 */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50/50">
        <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#20B9BE]" />
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                CHỈ SỐ CA TRỰC
              </span>
            </div>
            <span className="text-xs font-extrabold text-[#008284] bg-[#20B9BE]/10 px-1.5 py-0.5 rounded">
              {metrics?.shiftSlaPercent ? `${metrics.shiftSlaPercent}% SLA` : '100% SLA'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2.5">
            <div 
              className="bg-[#20B9BE] h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, Math.max(0, metrics?.shiftSlaPercent ?? 100))}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
            <span>Đã xử lý: <strong className="text-slate-900 font-bold">{metrics?.shiftProcessed ?? 0}</strong></span>
            <span>Tồn đọng: <strong className="text-amber-600 font-bold">{metrics?.shiftBacklog ?? 0}</strong></span>
          </div>
        </div>

        {/* Fleet telemetry quick indicator */}
        <div className="mt-2.5 px-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#20B9BE]" /> Đội xe VinFast Telematics
          </span>
          <span className="text-emerald-600 font-bold">
            {metrics?.inProgressTickets !== undefined ? `${metrics.inProgressTickets} đang hỗ trợ` : 'Trực tuyến'}
          </span>
        </div>
      </div>
    </aside>
  );
};
