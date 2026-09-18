/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MapPin, Zap, Navigation, Radio, Filter, Car, Search, ShieldCheck, RefreshCw } from 'lucide-react';
import { FleetTelemetryPoint } from '../../types';
import { fleetApi } from '../../services/api';

interface FleetMapViewProps {
  initialFleetPoints?: FleetTelemetryPoint[];
}

export const FleetMapView: React.FC<FleetMapViewProps> = ({ initialFleetPoints }) => {
  const [filterType, setFilterType] = useState<'all' | 'vehicles' | 'chargers'>('all');
  const [fleetPoints, setFleetPoints] = useState<FleetTelemetryPoint[]>(initialFleetPoints || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialFleetPoints && initialFleetPoints.length > 0) {
      setFleetPoints(initialFleetPoints);
      return;
    }

    let isMounted = true;
    const fetchPoints = async () => {
      setIsLoading(true);
      try {
        const points = await fleetApi.getFleetPoints(filterType);
        if (isMounted) setFleetPoints(points);
      } catch {
        if (isMounted) setFleetPoints([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchPoints();
    return () => {
      isMounted = false;
    };
  }, [filterType, initialFleetPoints]);

  const vehicles = fleetPoints.filter((p) => p.type === 'vehicle' || p.type === 'truck');
  const chargers = fleetPoints.filter((p) => p.type === 'charger');

  const displayedPoints = fleetPoints.filter((p) => {
    if (filterType === 'vehicles') return p.type === 'vehicle' || p.type === 'truck';
    if (filterType === 'chargers') return p.type === 'charger';
    return true;
  });

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col p-4">
      {/* Map Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#20B9BE]" />
            Bản Đồ Giám Sát Đội Xe & Hạ Tầng Trạm Sạc V-GREEN ({fleetPoints.length} điểm)
          </h2>
          <p className="text-xs text-slate-500">Giám sát vị trí thực thời qua thiết bị viễn thông T-Box VinFast Telematics</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'all' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
              }`}
            >
              Tất cả ({fleetPoints.length})
            </button>
            <button
              onClick={() => setFilterType('vehicles')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'vehicles' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
              }`}
            >
              Xe GSM ({vehicles.length})
            </button>
            <button
              onClick={() => setFilterType('chargers')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'chargers' ? 'bg-white shadow-2xs text-slate-900' : 'text-slate-600'
              }`}
            >
              Trạm V-GREEN ({chargers.length})
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

        {/* Loading overlay or Empty State */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 z-30">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-[#20B9BE]" />
              <span>Đang đồng bộ tọa độ Telematics...</span>
            </div>
          </div>
        ) : displayedPoints.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20">
            <Radio className="w-10 h-10 text-slate-700 mb-2 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-300">Chưa có tín hiệu định vị Telematics</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Hệ thống đang chờ thiết bị T-Box của xe và trụ sạc gửi tọa độ GPS lên máy chủ.
            </p>
          </div>
        ) : null}

        {/* Live coordinates pins */}
        {displayedPoints.map((item) => (
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
