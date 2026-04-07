import { useState } from 'react'
import { Play, Settings, TerminalSquare, Eye, LayoutTemplate, Code2, Network } from 'lucide-react'
import { CodeEditor } from './components/CodeEditor'
import { TerminalPanel } from './components/TerminalPanel'
import { AgentFlowCanvas } from './components/AgentFlowCanvas'
import { AiChatPanel } from './components/AiChatPanel'
import { FileExplorer } from './components/FileExplorer'

function App() {
  const [activeTab, setActiveTab] = useState<'flow' | 'code' | 'preview'>('flow');
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [code, setCode] = useState('// Click on an Agent node in the flow canvas to edit its Prompt or Code.\n');
  const [output, setOutput] = useState('Ready to execute multi-agent workflow...\n');

  return (
    <div className="flex h-screen w-full bg-[#1e1e1e] text-white overflow-hidden font-sans">
      
      {/* Sidebar - AI Chat */}
      <AiChatPanel />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        
        {/* Top Navbar */}
        <div className="h-12 bg-[#2d2d2d] border-b border-[#252526] flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="font-semibold text-sm flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-[#aa3bff]" />
              Vibe Coding Multi-Agent Builder
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-[#1e1e1e] p-1 rounded-md ml-4 border border-[#3c3c3c]">
              <button 
                onClick={() => setActiveTab('flow')}
                className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${activeTab === 'flow' ? 'bg-[#3c3c3c] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Network size={14} /> Agent Flow (流程)
              </button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${activeTab === 'code' ? 'bg-[#3c3c3c] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Code2 size={14} /> Code Editor (代码)
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs rounded transition-colors flex items-center gap-1 ${activeTab === 'preview' ? 'bg-[#3c3c3c] text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Eye size={14} /> UI Preview (预览)
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              className="flex items-center gap-2 px-4 py-1.5 bg-[#007acc] hover:bg-[#005999] text-white text-sm rounded transition-colors"
            >
              <Play className="w-4 h-4" />
              Deploy & Run
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {activeTab === 'code' && <FileExplorer />}

          {/* Middle: Canvas or Preview or Code */}
          <div className="flex-1 bg-[#1e1e1e] relative border-r border-[#252526]">
            {activeTab === 'flow' && (
              <AgentFlowCanvas onNodeClick={(e, node) => setSelectedNode(node)} />
            )}
            
            {activeTab === 'code' && (
              <CodeEditor 
                value={code} 
                onChange={(val) => setCode(val || '')} 
                language="python"
              />
            )}

            {activeTab === 'preview' && (
              <div className="w-full h-full flex items-center justify-center bg-white text-black p-8">
                {/* Mock UI Preview */}
                <div className="w-full max-w-2xl h-full border rounded-xl shadow-lg flex flex-col p-6 text-center justify-center">
                  <h2 className="text-2xl font-bold mb-4">AI Generated UI App</h2>
                  <p className="text-gray-500 mb-8">这是大模型根据左侧 Agent Flow 自动生成的前端交互界面。</p>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-48 mx-auto">
                    Test Agent Action
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Right Sidebar: Agent Config & Terminal (Only show in Flow mode or Code mode if needed, but let's keep it mostly for Flow) */}
          {activeTab === 'flow' && (
            <div className="w-96 bg-[#252526] flex flex-col shrink-0">
              {/* Config Header */}
              <div className="h-12 bg-[#2d2d2d] flex items-center px-4 font-semibold text-sm border-b border-[#3c3c3c] gap-2">
                <Settings size={16} />
                Node Config: {selectedNode ? selectedNode.data.label : 'No node selected'}
              </div>

              {/* Prompt/Code Editor */}
              <div className="flex-1 flex flex-col min-h-[50%] border-b border-[#3c3c3c]">
                <div className="p-2 bg-[#1e1e1e] text-xs text-gray-400 font-semibold tracking-wider">PROMPT / CODE</div>
                <div className="flex-1 relative">
                  {selectedNode ? (
                    <CodeEditor 
                      value={code} 
                      onChange={(val) => setCode(val || '')} 
                      language="python"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                      Select an agent node to edit
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal */}
              <div className="h-64 shrink-0 flex flex-col bg-[#1e1e1e]">
                <div className="p-2 bg-[#1e1e1e] text-xs text-gray-400 font-semibold tracking-wider border-b border-[#3c3c3c] flex items-center gap-2">
                  <TerminalSquare size={14} /> LOGS
                </div>
                <div className="flex-1">
                  <TerminalPanel output={output} />
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default App