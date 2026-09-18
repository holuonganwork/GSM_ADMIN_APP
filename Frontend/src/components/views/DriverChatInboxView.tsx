/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MessageSquare, Search, Send, CheckCheck, Phone, AlertCircle, RefreshCw, MessageCircle } from 'lucide-react';
import { DriverConversation, ChatMessage } from '../../types';
import { chatApi } from '../../services/api';

interface DriverChatInboxViewProps {
  onCallDriver: (name: string, phone: string) => void;
  initialConversations?: DriverConversation[];
}

export const DriverChatInboxView: React.FC<DriverChatInboxViewProps> = ({
  onCallDriver,
  initialConversations,
}) => {
  const [conversations, setConversations] = useState<DriverConversation[]>(initialConversations || []);
  const [activeChat, setActiveChat] = useState<DriverConversation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Load conversations from API on mount if not provided via props
  useEffect(() => {
    if (initialConversations && initialConversations.length > 0) {
      setConversations(initialConversations);
      setActiveChat(initialConversations[0]);
      return;
    }

    let isMounted = true;
    const loadConversations = async () => {
      setIsLoadingConversations(true);
      try {
        const data = await chatApi.getConversations();
        if (isMounted) {
          setConversations(data);
          if (data.length > 0) {
            setActiveChat(data[0]);
          }
        }
      } catch {
        // Fallback to empty if backend not online
        if (isMounted) {
          setConversations([]);
        }
      } finally {
        if (isMounted) setIsLoadingConversations(false);
      }
    };

    loadConversations();
    return () => {
      isMounted = false;
    };
  }, [initialConversations]);

  // Load messages when active chat changes
  useEffect(() => {
    if (!activeChat) {
      setChatMessages([]);
      return;
    }

    let isMounted = true;
    const loadMessages = async () => {
      setIsLoadingMessages(true);
      try {
        const messages = await chatApi.getMessages(activeChat.id);
        if (isMounted) setChatMessages(messages);
      } catch {
        // When backend empty or offline
        if (isMounted) setChatMessages([]);
      } finally {
        if (isMounted) setIsLoadingMessages(false);
      }
    };

    loadMessages();
    return () => {
      isMounted = false;
    };
  }, [activeChat?.id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const messageText = inputText.trim();
    const newMsg: ChatMessage = {
      id: Date.now(),
      sender: 'operator',
      text: messageText,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputText('');

    try {
      await chatApi.sendMessage(activeChat.id, messageText);
    } catch {
      // Optimistic message kept locally even if backend pending
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.driverName.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.car.toLowerCase().includes(q) ||
      c.lastMessage.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex h-full">
      {/* Left conversation list */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
        <div className="p-3 border-b border-slate-200">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#20B9BE]" />
              Hộp Thư Chat Điều Phối ({conversations.length})
            </span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tin nhắn, tên tài xế..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#20B9BE]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoadingConversations ? (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-100 animate-pulse space-y-2">
                  <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="py-16 px-4 text-center text-slate-400 text-xs">
              <MessageCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Chưa có phiên chat nào từ tài xế trong ca.
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = activeChat?.id === c.id;
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
            })
          )}
        </div>
      </div>

      {/* Right active chat dialogue */}
      {activeChat ? (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* Chat header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/60 shrink-0">
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
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              Gọi thoại
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
            {isLoadingMessages ? (
              <div className="py-8 text-center text-slate-400 text-xs">Đang tải tin nhắn...</div>
            ) : chatMessages.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs">
                Chưa có tin nhắn nào trong cuộc trao đổi này. Nhập nội dung bên dưới để bắt đầu.
              </div>
            ) : (
              chatMessages.map((m) => {
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
              })
            )}
          </div>

          {/* Input bar */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập tin nhắn phản hồi Bác tài..."
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#20B9BE]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#008284] hover:bg-[#006f71] disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white">
          <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Chưa chọn cuộc trò chuyện</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            Vui lòng chọn một tài xế trong danh sách bên trái để xem nội dung trao đổi hoặc bắt đầu chat hỗ trợ.
          </p>
        </div>
      )}
    </div>
  );
};
