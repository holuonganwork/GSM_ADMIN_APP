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
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const DriverDirectoryView: React.FC<DriverDirectoryViewProps> = ({
  onCallDriver,
  initialDrivers,
  searchQuery = '',
  onSearchChange,
}) => {
  const [search, setSearch] = useState('');
  const [drivers, setDrivers] = useState<DriverComplianceInfo[]>(initialDrivers || []);
  const [isLoading, setIsLoading] = useState(false);

  const activeQuery = searchQuery || search;

  useEffect(() => {
    if (initialDrivers) {
      setDrivers(initialDrivers);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    const timer = setTimeout(() => {
      complianceApi
        .getAllDrivers(activeQuery)
        .then((data) => {
          if (isMounted) {
            setDrivers(data || []);
          }
        })
        .catch((err) => {
          console.error('Lỗi khi nạp danh bạ tài xế từ API:', err);
          if (isMounted) {
            setDrivers([]);
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [initialDrivers, activeQuery]);

  const filtered = drivers.filter((d) => {
    if (!activeQuery.trim()) return true;
    const q = activeQuery.toLowerCase().trim();
    return (
      (d.name && d.name.toLowerCase().includes(q)) ||
      (d.cccd && d.cccd.toLowerCase().includes(q)) ||
      (d.phone && d.phone.toLowerCase().includes(q)) ||
      (d.plate && d.plate.toLowerCase().includes(q)) ||
      (d.id && d.id.toLowerCase().includes(q)) ||
      (d.vehicleModel && d.vehicleModel.toLowerCase().includes(q))
    );
  });

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
            value={activeQuery}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
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
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#20B9BE] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-medium">Đang tải hồ sơ tài xế từ hệ thống...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  <IdCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  {activeQuery.trim()
                    ? 'Không tìm thấy hồ sơ tài xế nào phù hợp với CCCD hoặc từ khóa tìm kiếm.'
                    : 'Chưa có hồ sơ tài xế nào trong hệ thống.'}
                </td>
              </tr>
            ) : (
              filtered.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900 text-sm">{d.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{d.id}</div>
                  </td>
                  {/* Căn cước công dân (CCCD) */}
                  <td className="p-3">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 text-xs">
                      {d.cccd}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-700 text-xs">{d.phone}</td>
                  <td className="p-3">
                    <div className="font-medium text-slate-800 text-sm">{d.vehicleModel}</div>
                    <div className="font-mono text-xs text-slate-500">{d.plate}</div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`font-black text-xs px-2.5 py-0.5 rounded-full ${
                        d.trustScore < 50 ? 'bg-rose-100 text-rose-700' :
                        d.trustScore < 75 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {d.trustScore}/100
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    {d.priorViolationsCount > 0 ? (
                      <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 font-bold border border-rose-200 text-xs">
                        {d.priorViolationsCount} lần
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-medium">0 lần (Tốt)</span>
                    )}
                  </td>
                  <td className="p-3">
                    {d.trustScore < 30 ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                        Đang tạm khóa
                      </span>
                    ) : d.trustScore < 60 ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                        Theo dõi đặc biệt
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                        Bình thường
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => onCallDriver(d.name, d.phone)}
                        className="px-3.5 py-1.5 btn-gsm-subtle rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#008284]" />
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
