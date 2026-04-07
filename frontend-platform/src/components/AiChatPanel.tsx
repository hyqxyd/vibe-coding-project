import React, { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AiChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的 Vibe Coding 助手。你可以告诉我你想搭建什么样的多智能体应用？我会帮你自动生成 Agent 流程图，甚至生成前端界面！'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `好的，我明白你需要构建 "${userMsg.content}"。我正在为你生成相关的智能体节点和配置，请在右侧画布中查看。`
      }]);
    }, 1000);
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
              {msg.content}
            </div>
          </div>
        ))}
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