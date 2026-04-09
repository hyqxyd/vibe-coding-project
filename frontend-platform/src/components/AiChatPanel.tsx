import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: {
    type: 'flow' | 'code' | 'preview';
    label: string;
    status: 'loading' | 'done';
  }[];
}

interface AiChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  isProcessing: boolean;
}

export function AiChatPanel({ messages, onSendMessage, isProcessing }: AiChatPanelProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="w-80 h-full bg-[#252526] border-r border-[#3c3c3c] flex flex-col">
      <div className="h-12 bg-[#2d2d2d] flex items-center px-4 font-semibold text-sm border-b border-[#3c3c3c]">
        AI 编程助手
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#007acc]' : 'bg-[#aa3bff]'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`px-3 py-2 rounded-lg text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-[#007acc] text-white' : 'bg-[#333333] text-gray-200'}`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
              
              {/* Dynamic Agent Generation Feedback */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="mt-3 space-y-2 border-t border-[#444] pt-2">
                  {msg.actions.map((action, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs bg-[#1e1e1e] px-2 py-1.5 rounded text-gray-300">
                      {action.status === 'loading' ? (
                        <Loader2 size={12} className="animate-spin text-blue-400" />
                      ) : (
                        <CheckCircle2 size={12} className="text-green-500" />
                      )}
                      <span>{action.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-[#2d2d2d] border-t border-[#3c3c3c]">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="描述你想生成的应用..."
            className="w-full bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-[#007acc] pr-10"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}