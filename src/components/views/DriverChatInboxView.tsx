/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageSquare, Search, Send, CheckCheck, Phone, AlertCircle } from 'lucide-react';

interface DriverChatInboxViewProps {
  onCallDriver: (name: string, phone: string) => void;
}

export const DriverChatInboxView: React.FC<DriverChatInboxViewProps> = ({ onCallDriver }) => {
  const conversations = [
    {
      id: 1,
      driverName: 'Lê Hoàng Long',
      phone: '0912.345.678',
      car: 'VF e34 • 29E-521.84',
      lastMessage: 'Dạ súng đã kêu "tách" mở rồi chị ơi...',
      time: '10:17',
      unread: 1,
      priority: 'P1',
    },
    {
      id: 2,
      driverName: 'Trần Văn Bình',
      phone: '0988.765.432',
      car: 'VF 8 • 30K-194.22',
      lastMessage: 'Em đang đỗ sảnh E ga T1 đợi khách VIP đây ạ',
      time: '10:12',
      unread: 0,
      priority: 'P2',
    },
    {
      id: 3,
      driverName: 'Phạm Thị Thu',
      phone: '0933.456.789',
      car: 'Feliz S • 29AA-492.01',
      lastMessage: 'Dạ em cảm ơn chị Chi đã giải đáp rõ ràng',
      time: '09:55',
      unread: 0,
      priority: 'P3',
    },
  ];

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'driver',
      text: 'Chị Chi ơi, súng sạc trụ 04 Times City cắm vào báo đèn đỏ xong không rút ra được, em đang chở khách gấp quá!',
      time: '10:14',
    },
    {
      id: 2,
      sender: 'operator',
      text: 'Chào Bác tài Long, em đã nhận được tín hiệu SOS. Em vừa gửi xung mở khoá từ xa rồi nhé.',
      time: '10:16',
    },
    {
      id: 3,
      sender: 'driver',
      text: 'Dạ súng đã kêu "tách" mở rồi chị ơi. Nhưng xe còn 8% pin thì sạc ở đâu bây giờ chị?',
      time: '10:17',
    },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setChatMessages([
      ...chatMessages,
      {
        id: Date.now(),
        sender: 'operator',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setInputText('');
  };

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex h-full">
      {/* Left conversation list */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-3 border-b border-slate-200">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#20B9BE]" />
            Hộp Thư Chat Điều Phối GSM
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm tin nhắn, tên tài xế..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#20B9BE]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.map((c) => {
            const isSelected = activeChat.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => setActiveChat(c)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#E3F8F8]/50 border-l-3 border-[#20B9BE]' : 'hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-xs text-slate-900">{c.driverName}</span>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mb-1">{c.car}</div>
                <p className="text-xs text-slate-600 line-clamp-1">{c.lastMessage}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right active chat dialogue */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#20B9BE]/20 text-[#006768] font-bold text-xs flex items-center justify-center">
              {activeChat.driverName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">{activeChat.driverName}</h3>
              <p className="text-[10px] text-slate-500 font-mono">{activeChat.car} • {activeChat.phone}</p>
            </div>
          </div>
          <button
            onClick={() => onCallDriver(activeChat.driverName, activeChat.phone)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5" />
            Gọi thoại
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
          {chatMessages.map((m) => {
            const isOperator = m.sender === 'operator';
            return (
              <div key={m.id} className={`flex flex-col ${isOperator ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isOperator
                      ? 'bg-[#008284] text-white rounded-br-xs shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                  {m.time}
                  {isOperator && <CheckCheck className="w-3 h-3 text-[#20B9BE]" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập tin nhắn phản hồi Bác tài..."
            className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#20B9BE]"
          />
          <button
            type="submit"
            className="p-2.5 bg-[#008284] hover:bg-[#006f71] text-white rounded-lg transition-colors active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
