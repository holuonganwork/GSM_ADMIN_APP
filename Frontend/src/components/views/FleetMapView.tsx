/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Zap, Navigation, Radio, Filter, Car, Search, ShieldCheck } from 'lucide-react';

export const FleetMapView: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'vehicles' | 'chargers'>('all');

  const fleetPoints = [
    { id: 1, type: 'vehicle', name: 'VF e34 (29E-521.84)', driver: 'Lê Hoàng Long', soc: 8, status: 'Lỗi sạc', top: '48%', left: '52%', isAlert: true },
    { id: 2, type: 'vehicle', name: 'VF 8 (30K-194.22)', driver: 'Trần Văn Bình', soc: 64, status: 'Đang chở khách VIP', top: '22%', left: '40%', isAlert: false },
    { id: 3, type: 'vehicle', name: 'VF 5 (29E-882.19)', driver: 'Nguyễn Quang Minh', soc: 42, status: 'Va quẹt nhẹ', top: '65%', left: '38%', isAlert: true },
    { id: 4, type: 'vehicle', name: 'VF 8 (30K-032.55)', driver: 'Hoàng Quốc Việt', soc: 76, status: 'Lỗi GPS', top: '15%', left: '60%', isAlert: false },
    { id: 5, type: 'charger', name: 'Trạm V-GREEN Times City', slots: '12/16 trụ trống', typeDesc: 'DC 60-150kW Supercharge', top: '50%', left: '55%', isAlert: true },
    { id: 6, type: 'charger', name: 'Trạm V-GREEN Vincom Royal City', slots: '20/24 trụ trống', typeDesc: 'DC 60kW Fast Charge', top: '62%', left: '32%', isAlert: false },
    { id: 7, type: 'charger', name: 'Trạm V-GREEN Sân bay Nội Bài T1', slots: '8/10 trụ trống', typeDesc: 'DC 250kW Ultra Fast', top: '18%', left: '42%', isAlert: false },
    { id: 8, type: 'truck', name: 'Xe sạc lưu động SLĐ-01', driver: 'Phạm Đức Dũng', soc: 92, status: 'Sẵn sàng điều phối', top: '46%', left: '50%', isAlert: false },
  ];

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col p-4">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#20B9BE]" />
            Bản Đồ Giám Sát Đội Xe & Hạ Tầng Trạm Sạc V-GREEN (Khu Vực Hà Nội)
          </h2>
          <p className="text-xs text-slate-500">Giám sát vị trí thực thời qua thiết bị viễn thông T-Box VinFast Telematics</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md transition-all ${filterType === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'}`}
            >
              Tất cả (8)
            </button>
            <button
              onClick={() => setFilterType('vehicles')}
              className={`px-3 py-1 rounded-md transition-all ${filterType === 'vehicles' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'}`}
            >
              Xe GSM (4)
            </button>
            <button
              onClick={() => setFilterType('chargers')}
              className={`px-3 py-1 rounded-md transition-all ${filterType === 'chargers' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'}`}
            >
              Trạm V-GREEN (3)
            </button>
          </div>
        </div>
      </div>

      {/* Visual Simulated Map Canvas */}
      <div className="flex-1 bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800 min-h-[450px]">
        {/* Stylized dark cartographic grid lines */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#20B9BE_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* River outline visual (Red River Hanoi) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
          <path d="M 100 0 Q 300 200 450 300 T 900 600" stroke="#20B9BE" strokeWidth="28" fill="none" strokeLinecap="round" />
          <path d="M 0 450 Q 250 400 450 480 T 800 700" stroke="#38bdf8" strokeWidth="16" fill="none" strokeLinecap="round" />
        </svg>

        {/* Live coordinates pins */}
        {fleetPoints
          .filter((p) => filterType === 'all' || (filterType === 'vehicles' && p.type === 'vehicle') || (filterType === 'chargers' && p.type === 'charger'))
          .map((item) => (
            <div
              key={item.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
              style={{ top: item.top, left: item.left }}
            >
              {/* Pulsing ring for alerts */}
              {item.isAlert && (
                <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping"></span>
              )}

              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${
                item.type === 'charger'
                  ? 'bg-emerald-600 border-white text-white'
                  : item.type === 'truck'
                  ? 'bg-amber-500 border-white text-white'
                  : item.isAlert
                  ? 'bg-rose-600 border-white text-white'
                  : 'bg-[#20B9BE] border-white text-white'
              }`}>
                {item.type === 'charger' ? (
                  <Zap className="w-4 h-4" />
                ) : item.type === 'truck' ? (
                  <Navigation className="w-4 h-4" />
                ) : (
                  <Car className="w-4 h-4" />
                )}
              </div>

              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 bg-slate-900/95 text-white text-xs rounded-lg p-2.5 shadow-xl border border-slate-700 z-30">
                <div className="font-bold text-white text-[11px]">{item.name}</div>
                <div className="text-[10px] text-slate-300 mt-0.5">{item.driver || item.typeDesc}</div>
                <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-800 text-[10px]">
                  <span className={item.isAlert ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {item.status || item.slots}
                  </span>
                  {item.soc !== undefined && (
                    <span className="font-mono text-slate-400">SoC: {item.soc}%</span>
                  )}
                </div>
              </div>
            </div>
          ))}

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs text-white backdrop-blur-xs space-y-1.5 z-20">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Chú giải bản đồ GSM</div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-rose-500"></span>
            <span>Xe có sự cố khẩn cấp (P1)</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-[#20B9BE]"></span>
            <span>Xe GSM đang hoạt động</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Trạm sạc nhanh V-GREEN</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            <span>Xe sạc lưu động phản ứng nhanh</span>
          </div>
        </div>
      </div>
    </div>
  );
};
