/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Driver Compliance Directory (Tra cứu hồ sơ tuân thủ & CCCD tài xế)
 */

import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Phone, Star, Car, ShieldCheck, ShieldAlert, IdCard, AlertTriangle } from 'lucide-react';
import { DriverComplianceInfo } from '../../types';
import { complianceApi } from '../../services/api';

interface DriverDirectoryViewProps {
  onCallDriver: (name: string, phone: string) => void;
  onViewCase?: (driverCccd: string) => void;
  initialDrivers?: DriverComplianceInfo[];
}

export const DriverDirectoryView: React.FC<DriverDirectoryViewProps> = ({
  onCallDriver,
  initialDrivers,
}) => {
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState<DriverComplianceInfo[]>(initialDrivers || [
    {
      id: 'TX-0921',
      name: 'Lê Hoàng Long',
      cccd: '001094012845',
      phone: '0912.345.678',
      plate: '29E-521.84',
      vehicleModel: 'VinFast VF e34',
      trustScore: 48,
      priorViolationsCount: 1,
      completedRides: 1420,
      rating: 4.88,
    },
    {
      id: 'TX-1482',
      name: 'Trần Văn Bình',
      cccd: '024091004512',
      phone: '0988.765.432',
      plate: '30K-194.22',
      vehicleModel: 'VinFast VF 8',
      trustScore: 35,
      priorViolationsCount: 2,
      completedRides: 2840,
      rating: 4.92,
    },
    {
      id: 'TX-0774',
      name: 'Nguyễn Quang Minh',
      cccd: '033095011984',
      phone: '0977.123.888',
      plate: '29E-882.19',
      vehicleModel: 'VinFast VF 5 Plus',
      trustScore: 82,
      priorViolationsCount: 0,
      completedRides: 910,
      rating: 4.95,
    },
    {
      id: 'TX-3102',
      name: 'Phạm Thị Thu',
      cccd: '001198007621',
      phone: '0933.456.789',
      plate: '29AA-492.01',
      vehicleModel: 'VinFast Feliz S',
      trustScore: 94,
      priorViolationsCount: 0,
      completedRides: 3100,
      rating: 4.98,
    },
    {
      id: 'TX-2019',
      name: 'Hoàng Quốc Việt',
      cccd: '017089002341',
      phone: '0904.567.890',
      plate: '30K-032.55',
      vehicleModel: 'VinFast VF 8',
      trustScore: 40,
      priorViolationsCount: 1,
      completedRides: 1820,
      rating: 4.89,
    },
    {
      id: 'TX-4402',
      name: 'Đặng Tuấn Kiệt',
      cccd: '001090001923',
      phone: '0981.999.888',
      plate: '30K-441.22',
      vehicleModel: 'VinFast VF 8',
      trustScore: 20,
      priorViolationsCount: 3,
      completedRides: 890,
      rating: 4.75,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialDrivers && initialDrivers.length > 0) {
      setDrivers(initialDrivers);
    }
  }, [initialDrivers]);

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.cccd.includes(search) ||
      d.phone.includes(search) ||
      d.plate.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#20B9BE]" />
            Tra Cứu Hồ Sơ Tín Nhiệm & Tuân Thủ Tài Xế ({drivers.length} tài xế)
          </h2>
          <p className="text-xs text-slate-500">
            Tra cứu theo số CCCD, đánh giá mức độ rủi ro gian lận và kiểm tra lịch sử tiền lệ
          </p>
        </div>

        {/* Search */}
        <div className="relative w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo CCCD, tên, SĐT, biển số..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#20B9BE]"
          />
        </div>
      </div>

      {/* Table - Explicitly NO team column, has CCCD */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider sticky top-0 z-10">
              <th className="p-3">Mã TX & Họ Tên</th>
              <th className="p-3">Số Căn Cước (CCCD)</th>
              <th className="p-3">Số Điện Thoại</th>
              <th className="p-3">Phương Tiện VinFast</th>
              <th className="p-3 text-center">Điểm Tín Nhiệm</th>
              <th className="p-3 text-center">Tiền Lệ Vi Phạm</th>
              <th className="p-3">Tình Trạng</th>
              <th className="p-3 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  <IdCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  Không tìm thấy hồ sơ tài xế nào phù hợp với CCCD hoặc từ khóa tìm kiếm.
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{d.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{d.id}</div>
                  </td>
                  {/* Căn cước công dân (CCCD) */}
                  <td className="p-3">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {d.cccd}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-700">{d.phone}</td>
                  <td className="p-3">
                    <div className="font-medium text-slate-800">{d.vehicleModel}</div>
                    <div className="font-mono text-[10px] text-slate-500">{d.plate}</div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`font-black text-xs px-2 py-0.5 rounded-full ${
                        d.trustScore < 50 ? 'bg-rose-100 text-rose-700' :
                        d.trustScore < 75 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {d.trustScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {d.priorViolationsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[11px]">
                        {d.priorViolationsCount} lần
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">0 lần (Tốt)</span>
                    )}
                  </td>
                  <td className="p-3">
                    {d.trustScore < 30 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Đang tạm khóa
                      </span>
                    ) : d.trustScore < 60 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Theo dõi đặc biệt
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                        Bình thường
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => onCallDriver(d.name, d.phone)}
                        className="px-2.5 py-1 btn-gsm-subtle rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3 h-3 text-[#008284]" />
                        Gọi đối soát
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
