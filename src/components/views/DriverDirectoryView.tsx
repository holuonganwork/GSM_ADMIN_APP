/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCheck, Search, Phone, Star, Car, ShieldCheck, Filter } from 'lucide-react';

interface DriverDirectoryViewProps {
  onCallDriver: (name: string, phone: string) => void;
  onChatDriver: (name: string) => void;
}

export const DriverDirectoryView: React.FC<DriverDirectoryViewProps> = ({
  onCallDriver,
  onChatDriver,
}) => {
  const [search, setSearch] = useState('');

  const drivers = [
    {
      id: 'TX-0921',
      name: 'Lê Hoàng Long',
      phone: '0912.345.678',
      vehicle: 'VinFast VF e34 (29E-521.84)',
      rating: 4.96,
      rides: 1420,
      team: 'Đội 1 - Times City',
      status: 'Sự cố sạc pin (P1)',
      statusColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'TX-1482',
      name: 'Trần Văn Bình',
      phone: '0988.765.432',
      vehicle: 'VinFast VF 8 (30K-194.22)',
      rating: 4.98,
      rides: 2840,
      team: 'Đội 2 - Sân bay Nội Bài',
      status: 'Chờ giao vali VIP',
      statusColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'TX-0774',
      name: 'Nguyễn Quang Minh',
      phone: '0977.123.888',
      vehicle: 'VinFast VF 5 Plus (29E-882.19)',
      rating: 4.88,
      rides: 910,
      team: 'Đội 1 - Thanh Xuân',
      status: 'Đang chờ cứu trợ va quẹt',
      statusColor: 'bg-rose-100 text-rose-700',
    },
    {
      id: 'TX-3102',
      name: 'Phạm Thị Thu',
      phone: '0933.456.789',
      vehicle: 'VinFast Feliz S (29AA-492.01)',
      rating: 4.95,
      rides: 3100,
      team: 'GreenBike Đống Đa',
      status: 'Sẵn sàng nhận chuyến',
      statusColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'TX-2019',
      name: 'Hoàng Quốc Việt',
      phone: '0904.567.890',
      vehicle: 'VinFast VF 8 (30K-032.55)',
      rating: 4.91,
      rides: 1820,
      team: 'Đội 3 - Cầu Giấy',
      status: 'Đã khôi phục GPS',
      statusColor: 'bg-blue-100 text-blue-700',
    },
  ];

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search) ||
      d.vehicle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col p-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 mb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#20B9BE]" />
            Danh Sách Quản Lý Tài Xế Đội 1 & Đội Phối Hợp (GSM Driver Network)
          </h2>
          <p className="text-xs text-slate-500">Tra cứu nhanh hồ sơ tài xế, tình trạng vận hành và kết nối hỗ trợ trực tiếp</p>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên, SĐT, biển số..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#20B9BE]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
              <th className="p-3">Mã TX & Họ Tên</th>
              <th className="p-3">Số Điện Thoại</th>
              <th className="p-3">Phương Tiện VinFast</th>
              <th className="p-3">Đánh Giá & Chuyến</th>
              <th className="p-3">Đội Xe</th>
              <th className="p-3">Trạng Thái Ca</th>
              <th className="p-3 text-right">Tương Tác Nhanh</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="p-3">
                  <div className="font-bold text-slate-900">{d.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{d.id}</div>
                </td>
                <td className="p-3 font-mono font-medium text-slate-700">{d.phone}</td>
                <td className="p-3 font-medium text-slate-800">{d.vehicle}</td>
                <td className="p-3">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    {d.rating}
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="text-[10px] text-slate-500">{d.rides} chuyến hoàn thành</div>
                </td>
                <td className="p-3 text-slate-600 font-medium">{d.team}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${d.statusColor}`}>
                    {d.status}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => onCallDriver(d.name, d.phone)}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-[11px] font-bold flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      Gọi
                    </button>
                    <button
                      onClick={() => onChatDriver(d.name)}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 rounded text-[11px] font-bold"
                    >
                      Chat
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
