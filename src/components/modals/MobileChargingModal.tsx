/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Zap, Truck, Navigation, CheckCircle2, BatteryCharging } from 'lucide-react';

interface MobileChargingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileChargingModal: React.FC<MobileChargingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [dispatchedTruck, setDispatchedTruck] = useState<string | null>(null);

  const trucks = [
    {
      id: 'SLĐ-01',
      plate: '29C-992.14',
      type: 'Xe cứu trợ sạc di động VinFast 80kW',
      driver: 'Phạm Đức Dũng',
      battery: 92,
      distance: '1.2 km',
      eta: '4 phút',
      status: 'Sẵn sàng điều phối',
      location: 'Chân cầu Vĩnh Tuy, Q. Hai Bà Trưng',
    },
    {
      id: 'SLĐ-04',
      plate: '29C-815.30',
      type: 'Xe cứu trợ sạc di động VinFast 60kW',
      driver: 'Hoàng Minh Tuấn',
      battery: 78,
      distance: '2.8 km',
      eta: '9 phút',
      status: 'Sẵn sàng điều phối',
      location: 'Phố Đại Cồ Việt, Q. Hai Bà Trưng',
    },
  ];

  if (!isOpen) return null;

  const handleDispatch = (truckId: string) => {
    setDispatchedTruck(truckId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-600 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Đội Xe Sạc Lưu Động GSM (Mobile Fast Charging)</h3>
              <p className="text-[11px] text-slate-500">2 xe gần nhất xung quanh khu vực Times City</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Truck List */}
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
          {trucks.map((truck) => {
            const isDispatched = dispatchedTruck === truck.id;

            return (
              <div
                key={truck.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isDispatched
                    ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                      {truck.id} ({truck.plate})
                    </span>
                    <span className="text-xs font-semibold text-slate-900">{truck.type}</span>
                  </div>
                  <span className="text-xs font-bold text-[#008284] bg-[#20B9BE]/10 px-2 py-0.5 rounded-full">
                    {truck.eta} ({truck.distance})
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 my-2 pt-2 border-t border-slate-100">
                  <div>Tài xế vận hành: <strong className="text-slate-800">{truck.driver}</strong></div>
                  <div className="flex items-center gap-1">
                    Dung lượng trạm pin: <strong className="text-emerald-600">{truck.battery}%</strong>
                  </div>
                  <div className="col-span-2 text-slate-500 truncate">
                    Vị trí hiện tại: {truck.location}
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  {isDispatched ? (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Đã phát lệnh điều xe tới hiện trường
                    </span>
                  ) : (
                    <button
                      onClick={() => handleDispatch(truck.id)}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[#008284] hover:bg-[#006f71] text-white text-xs font-bold rounded-lg shadow-xs active:scale-98"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Điều xe sạc tới xe khách
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
