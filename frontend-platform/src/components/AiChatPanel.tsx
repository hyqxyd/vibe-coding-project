import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actions?: {
    type: 'flow' | 'code' | 'preview';
    label: string;
    status: 'loading' | 'done';
  }[];
}

export function AiChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是你的 Vibe Coding 助手。你可以告诉我你想搭建什么样的多智能体应用？我会帮你生成 Agent 流程图，如果你想自己写代码，也可以在顶部切换到“Code Editor”自己动手修改！'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Mock AI response process (Idea -> Reality)
    const assistantMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: assistantMsgId,
      role: 'assistant',
      content: `收到！正在将你的想法转化为实际项目...`,
      actions: [
        { type: 'flow', label: '规划多智能体流转图...', status: 'loading' }
      ]
    }]);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { 
              ...msg, 
              actions: [
                { type: 'flow', label: '多智能体流转图已生成', status: 'done' },
                { type: 'code', label: '生成核心处理逻辑代码...', status: 'loading' }
              ] 
            } 
          : msg
      ));
    }, 1500);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId 
          ? { 
              ...msg, 
              content: `我已经为你搭建好了基础架构！\n\n你可以：\n1. 在中间的【Agent Flow】修改 Prompt。\n2. 点击顶部的【Code Editor】发挥你的能动性，亲自修改底层的 Python 逻辑或前端 UI 样式。\n3. 最后点击【UI Preview】查看效果。`,
              actions: [
                { type: 'flow', label: '多智能体流转图已生成', status: 'done' },
                { type: 'code', label: '后端逻辑与前端框架已生成', status: 'done' }
              ] 
            } 
          : msg
      ));
    }, 3000);
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