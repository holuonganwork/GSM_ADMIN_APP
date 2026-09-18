/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Send, User, Bot, Sparkles, CheckCheck } from 'lucide-react';

interface DriverChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverName: string;
}

export const DriverChatModal: React.FC<DriverChatModalProps> = ({
  isOpen,
  onClose,
  driverName,
}) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'driver',
      text: 'Chị Chi ơi, súng sạc trụ 04 Times City cắm vào báo đèn đỏ xong không rút ra được, em đang chở khách gấp quá!',
      time: '10:14',
    },
    {
      id: 2,
      sender: 'operator',
      text: 'Chào Bác tài Long, em đã nhận được tín hiệu SOS. Em vừa gửi lệnh kích hoạt nhả chốt khẩn cấp từ xa rồi nhé.',
      time: '10:16',
    },
    {
      id: 3,
      sender: 'driver',
      text: 'Dạ súng đã kêu "tách" mở rồi chị ơi. Nhưng xe còn 8% pin thì sạc ở đâu bây giờ chị?',
      time: '10:17',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'operator',
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMsg]);
    setInputMessage('');
  };

  const handleSendMacro = (text: string) => {
    const newMsg = {
      id: Date.now(),
      sender: 'operator',
      text,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMsg]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col h-[520px]">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#20B9BE]/15 text-[#006768] font-bold flex items-center justify-center text-xs">
              {driverName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900">{driverName}</h3>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Đang trực tuyến trên App GSM Driver
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message stream */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 bg-slate-50/50">
          {messages.map((m) => {
            const isOperator = m.sender === 'operator';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isOperator ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                    isOperator
                      ? 'bg-[#008284] text-white rounded-br-xs'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 px-1 flex items-center gap-1">
                  {m.time}
                  {isOperator && <CheckCheck className="w-3 h-3 text-[#20B9BE]" />}
                </span>
              </div>
            );
          })}
        </div>

        {/* Quick Macros */}
        <div className="px-3 py-2 border-t border-slate-100 bg-white flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => handleSendMacro('Bác tài vui lòng chuyển sang Trụ #06 cách đó 15m đang sẵn sàng sạc nhanh nhé.')}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-semibold rounded-full whitespace-nowrap"
          >
            ⚡ Chuyển sang Trụ #06
          </button>
          <button
            onClick={() => handleSendMacro('Hệ thống đã tặng voucher 50.000đ bồi hoàn vào ví tài xế của Bác rồi ạ!')}
            className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-semibold rounded-full whitespace-nowrap"
          >
            🎁 Đã tặng Voucher 50k
          </button>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="p-2.5 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Nhập tin nhắn gửi tới App tài xế..."
            className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#20B9BE]"
          />
          <button
            type="submit"
            className="p-2 bg-[#008284] hover:bg-[#006f71] text-white rounded-lg transition-colors active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
