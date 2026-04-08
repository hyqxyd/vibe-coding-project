import React, { useState, useRef, useCallback } from 'react'
import { Play, Settings, TerminalSquare, Eye, LayoutTemplate, Code2, Network, X, ChevronDown, ChevronRight } from 'lucide-react'
import { LiveProvider, LivePreview, LiveError } from 'react-live'
import { CodeEditor } from './components/CodeEditor'
import { TerminalPanel } from './components/TerminalPanel'
import { AgentFlowCanvas } from './components/AgentFlowCanvas'
import { AiChatPanel } from './components/AiChatPanel'
import { FileExplorer } from './components/FileExplorer'
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react'
import type { Node, Edge, Connection } from '@xyflow/react'

const initialNodes: Node[] = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Input: Product Info', filename: 'src/data/Input_1.json' }, type: 'input' },
  { id: '2', position: { x: 100, y: 250 }, data: { label: 'Agent: Copywriter', filename: 'src/agents/Agent_2.py' } },
  { id: '3', position: { x: 100, y: 400 }, data: { label: 'Output: UI Card', filename: 'src/data/Output_3.json' }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

function App() {
  const [activeTab, setActiveTab] = useState<'flow' | 'code' | 'preview'>('flow');
  
  // Lift Flow state up to App to prevent losing state on tab switch
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  // Right sidebar state
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configTab, setConfigTab] = useState<'prompt' | 'code'>('prompt');
  const [isParamsOpen, setIsParamsOpen] = useState(true);
  const [isLogsOpen, setIsLogsOpen] = useState(true);
  
  // Node parameters extraction & management
  const extractParams = (prompt: string) => {
    const matches = prompt.match(/\{([a-zA-Z0-9_]+)\}/g) || [];
    return Array.from(new Set(matches.map(m => m.slice(1, -1))));
  };
  const [nodeParams, setNodeParams] = useState<Record<string, Record<string, string>>>({});
  const handleParamChange = (nodeId: string, paramKey: string, value: string) => {
    setNodeParams(prev => ({
      ...prev,
      [nodeId]: { ...(prev[nodeId] || {}), [paramKey]: value }
    }));
  };

  const [output, setOutput] = useState('Ready to execute multi-agent workflow...\n');

  // File Explorer state
  const [selectedFile, setSelectedFile] = useState<string | undefined>(undefined);
  const [editorContent, setEditorContent] = useState<string>('// Select a file from the explorer to edit\n');
  const [editorLanguage, setEditorLanguage] = useState<string>('javascript');

  const [files, setFiles] = useState<Record<string, { content: string, language: string }>>({
    'src/data/Input_1.json': { content: '{\n  "product_name": "便携式咖啡机",\n  "features": "小巧轻便，高压萃取，无需插电"\n}\n', language: 'json' },
    'src/agents/Agent_2.py': { content: 'import json\nimport sys\nimport os\n\ndef process():\n    try:\n        # 从相对路径读取文件\n        with open("../data/Input_1.json", "r", encoding="utf-8") as f:\n            input_data = json.load(f)\n    except FileNotFoundError:\n        print("Error: Input_1.json not found.", file=sys.stderr)\n        sys.exit(1)\n\n    product_name = input_data.get("product_name", "Unknown")\n    features = input_data.get("features", "None")\n    \n    print(f"Processing product: {product_name} with features: {features}")\n    \n    # TODO: Connect to real LLM API\n    # Mocking LLM response for now\n    mock_llm_response = f"☕️ 早八人的救星来啦！\\n✨ 这款【{product_name}】绝对是打工人的随身好物！\\n🔥 {features}！#好物分享 #日常"\n    \n    output_data = {\n        "ui_component": "SocialMediaCard",\n        "data": {\n            "title": f"推荐：{product_name}",\n            "copywriting": mock_llm_response\n        }\n    }\n    \n    # 写入相对路径\n    with open("../data/Output_3.json", "w", encoding="utf-8") as f:\n        json.dump(output_data, f, ensure_ascii=False, indent=2)\n        \n    print("Output successfully written to Output_3.json")\n\nif __name__ == "__main__":\n    process()\n', language: 'python' },
    'src/data/Output_3.json': { content: '{\n  "ui_component": "SocialMediaCard",\n  "data": {\n    "title": "Waiting...",\n    "copywriting": "Waiting..."\n  }\n}\n', language: 'json' },
    'src/App.tsx': { content: 'import React from "react";\n\nexport default function App() {\n  return <div>App Preview</div>;\n}\n', language: 'typescript' },
    'src/ui/SocialMediaCard.tsx': { content: `function SocialMediaCard({ title, copywriting, image }) {
  return (
    <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transform transition-all hover:scale-105 duration-300">
      <div className="h-48 bg-gray-100 flex items-center justify-center relative overflow-hidden">
        {image ? (
          <img src={image} alt="Product" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-200 flex items-center justify-center">
            <span className="text-6xl">☕️</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-orange-600 shadow-sm">
          好物推荐
        </div>
      </div>
      <div className="p-6 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800 leading-tight">
          {title || 'Waiting for Output...'}
        </h2>
        <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
          {copywriting || '在左侧输入信息并点击生成，体验 AI Agent 工作流！'}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">U</div>
            <span className="text-xs text-gray-500 font-medium">Vibe User</span>
          </div>
          <button className="px-4 py-1.5 bg-red-50 text-red-500 rounded-full text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1">
            <span>❤️</span> 喜欢
          </button>
        </div>
      </div>
    </div>
  );
}

render(<SocialMediaCard title={title} copywriting={copywriting} image={image} />);
`, language: 'typescript' },
    'main.go': { content: 'package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello, Vibe Coding!")\n}\n', language: 'go' },
    'config.json': { content: '{\n  "port": 8080,\n  "env": "development"\n}\n', language: 'json' },
  });

  const [prompts, setPrompts] = useState<Record<string, string>>({
    '1': '请在下方填写用于测试的商品信息：\n{product_name}\n{features}',
    '2': '你是一个资深的小红书爆款写手。请根据以下产品信息撰写一篇带 Emoji 的种草文案：\n产品名称：{product_name}\n核心卖点：{features}',
    '3': '将上一步生成的文案映射到 UI 组件中展示。',
  });

  const handlePromptChange = (nodeId: string, value: string) => {
    setPrompts(prev => ({ ...prev, [nodeId]: value }));
  };

  const handleDeployAndRun = () => {
    setOutput(prev => prev + `\n[System] Starting deployment...\n[System] Compiling workflow.json from visual graph...\n`);
    
    // Reset output card to waiting state before deploying
    setFiles(prev => ({
      ...prev,
      'src/data/Output_3.json': {
        ...prev['src/data/Output_3.json'],
        content: `{\n  "ui_component": "SocialMediaCard",\n  "data": {\n    "title": "Waiting for Output...",\n    "copywriting": "Please click \\"Generate\\" in the Preview Panel to test the flow."\n  }\n}\n`
      }
    }));
    
    // Simulate compilation delay
    setTimeout(() => {
      setOutput(prev => prev + `[System] Extracting parameters from Agent prompts...\n`);
      setOutput(prev => prev + `[System] Deployment successful! Switching to UI Preview mode.\n\n`);
      setActiveTab('preview');
    }, 1500);
  };

  const syncFileToBackend = async (filename: string, content: string) => {
    try {
      const workspaceId = 'vibe-test-ws-1'; // Mock workspace
      
      const response = await fetch(`http://localhost:8080/api/v1/workspace/${workspaceId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: { [filename]: content },
          command: 'echo "Sync successful"',
          timeoutSeconds: 5
        })
      });
      
      if (response.ok) {
        setOutput(prev => prev + `[Debounced Sync] ${filename} auto-saved to Cloud Workspace VFS successfully.\n`);
      } else {
        setOutput(prev => prev + `[Sync Error] Failed to save ${filename} to Cloud Workspace.\n`);
      }
    } catch (error) {
      // 容错：如果后端没开，至少我们在前端内存里已经存了，不影响学生使用
      setOutput(prev => prev + `[Local Sync] ${filename} saved to Local VFS. (Cloud disconnected)\n`);
    }
  };

  const debounceTimerRef = useRef<any>(null);

  const [userChatInput, setUserChatInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUserSubmit = async () => {
    if (!userChatInput.trim() && !uploadedImage) {
      setOutput(prev => prev + `\n[Warning] 缺少输入：请在左侧面板输入产品描述或上传图片后再点击生成卡片！\n`);
      return;
    }

    setOutput(prev => prev + `\n[User Action] Submitted new data to pipeline.\n[System] Extracting product info...\n`);
    
    const currentInput = userChatInput;
    const finalProductName = currentInput ? currentInput.substring(0, 10) + (currentInput.length > 10 ? "..." : "") : "图片同款";
    const finalFeatures = currentInput || "用户上传了图片，请根据图片识别卖点";

    const inputJson = {
      product_name: finalProductName,
      features: finalFeatures
    };
    
    const inputContent = JSON.stringify(inputJson, null, 2);

    setFiles(prev => ({
      ...prev,
      'src/data/Input_1.json': {
        ...prev['src/data/Input_1.json'],
        content: inputContent
      }
    }));
    
    try {
      const workspaceId = 'vibe-test-ws-1';
      const payloadFiles: Record<string, string> = {};
      
      // Pack all current files
      for (const [fname, fobj] of Object.entries(files)) {
        payloadFiles[fname] = fobj.content;
      }
      // Override with new input
      payloadFiles['src/data/Input_1.json'] = inputContent;

      setOutput(prev => prev + `[System] Sending execution request to Docker sandbox...\n`);

      const response = await fetch(`http://localhost:8080/api/v1/workspace/${workspaceId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: payloadFiles,
          command: 'cd src/agents && python Agent_2.py && echo "===OUTPUT_START===" && cat ../data/Output_3.json',
          timeoutSeconds: 10
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.exitCode === 0) {
          setOutput(prev => prev + `[Docker Execution] Success!\n[Stdout]\n${result.stdout}\n`);
          
          // Parse the generated Output_3.json from stdout
          const outputParts = result.stdout.split('===OUTPUT_START===\n');
          if (outputParts.length > 1) {
            const generatedJson = outputParts[1].trim();
            setFiles(prev => ({
              ...prev,
              'src/data/Output_3.json': {
                ...prev['src/data/Output_3.json'],
                content: generatedJson
              }
            }));
            setOutput(prev => prev + `[System] Agent pipeline executed. UI updated from real Docker execution.\n`);
          } else {
             setOutput(prev => prev + `[System Error] Could not find Output_3.json in output.\n`);
          }
        } else {
          setOutput(prev => prev + `[Docker Error] Pipeline failed with exit code ${result.exitCode}.\n[Stderr]\n${result.stderr}\n`);
          
          setFiles(prev => ({
            ...prev,
            'src/data/Output_3.json': {
              ...prev['src/data/Output_3.json'],
              content: JSON.stringify({
                ui_component: "SocialMediaCard",
                data: {
                  title: "⚠️ 脚本执行报错",
                  copywriting: `后端 Python 执行失败，请检查代码或日志：\n\n${result.stderr}`
                }
              }, null, 2)
            }
          }));
          
          alert(`⚠️ 后端脚本执行失败！\n\n${result.stderr}\n\n请在 "Code Editor" 视图或 LOGS 面板中检查 Agent_2.py 语法。`);
        }
      } else {
        setOutput(prev => prev + `[System Error] Backend API request failed.\n`);
      }
    } catch (error: any) {
      setOutput(prev => prev + `[System Error] Failed to connect to backend: ${error.message}\n`);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setOutput(prev => prev + `[User Action] Uploaded image: ${file.name}\n`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditorChange = (val: string) => {
    setEditorContent(val);
    if (!selectedFile) return;

    setFiles(prev => ({
      ...prev,
      [selectedFile]: { ...prev[selectedFile], content: val }
    }));

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      syncFileToBackend(selectedFile, val);
    }, 1000);
  };

  const handleFileSelect = (fileName: string) => {
    setSelectedFile(fileName);
    if (files[fileName]) {
      setEditorContent(files[fileName].content);
      setEditorLanguage(files[fileName].language);
    } else {
      setEditorContent('// File content not found');
      setEditorLanguage('plaintext');
    }
  };

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
              onClick={handleDeployAndRun}
              className="flex items-center gap-2 px-4 py-1.5 bg-[#007acc] hover:bg-[#005999] text-white text-sm rounded transition-colors"
            >
              <Play className="w-4 h-4" />
              Deploy & Run
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          
          {activeTab === 'code' && <FileExplorer onFileSelect={handleFileSelect} activeFile={selectedFile} files={files} />}

          {/* Middle: Canvas or Preview or Code */}
          <div className="flex-1 bg-[#1e1e1e] relative border-r border-[#252526]">
            {activeTab === 'flow' && (
              <AgentFlowCanvas 
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={(e, node) => {
                  setSelectedNode(node);
                  setIsConfigOpen(true);
                  if (node.data.filename) {
                    const fname = node.data.filename as string;
                    setSelectedFile(fname);
                    setEditorContent(files[fname]?.content || '// No file linked');
                    setEditorLanguage(files[fname]?.language || 'plaintext');
                  }
                }} 
                onNodesDelete={(deletedNodes) => {
                  deletedNodes.forEach(n => {
                    setOutput(prev => prev + `[DSL Update] Node '${n.data.label}' unbound from workflow.json. (Source files kept safe in workspace)\n`);
                  });
                }}
                onEdgesDelete={(deletedEdges) => {
                  deletedEdges.forEach(e => {
                    setOutput(prev => prev + `[DSL Update] Connection removed in workflow.json.\n`);
                  });
                }}
                onConnect={(connection) => {
                  onConnect(connection);
                  setOutput(prev => prev + `[DSL Update] New connection added to workflow.json.\n`);
                }}
                onNodeAdd={(node, templateType) => {
                  let filename = '';
                  let initialContent = '';
                  let language = '';

                  if (templateType === 'ai_agent') {
                    filename = `src/agents/Agent_${node.id.substring(5)}.py`;
                    initialContent = `import json\n\ndef process(data):\n    # TODO: Modify this Python Agent\n    print(f"Python agent received: {data}")\n    return data\n`;
                    language = 'python';
                  } else if (templateType === 'action_tool') {
                    filename = `src/tools/Tool_${node.id.substring(5)}.py`;
                    initialContent = `def execute_tool(params):\n\t# TODO: Call external API or DB here\n\treturn {"status": "success"}\n`;
                    language = 'python';
                  } else if (templateType === 'input_trigger') {
                    filename = `src/data/Input_${node.id.substring(5)}.json`;
                    initialContent = `{\n  "trigger": "manual"\n}\n`;
                    language = 'json';
                  } else if (templateType === 'output_result') {
                    filename = `src/data/Output_${node.id.substring(5)}.json`;
                    initialContent = `{\n  "result": "Pending"\n}\n`;
                    language = 'json';
                  }

                  node.data.filename = filename;
                  setNodes(nds => [...nds, node]);

                  setFiles(prev => ({
                    ...prev,
                    [filename]: { content: initialContent, language }
                  }));
                  setPrompts(prev => ({
                    ...prev,
                    [node.id]: `System Prompt for ${node.data.label}.\nUse {variable_name} to extract dynamic inputs.`
                  }));
                  
                  setOutput(prev => prev + `[DSL Update] Added new node '${node.data.label}' to flow.\n[VFS] Generated template file: ${filename}\n`);
                  
                  // Auto-select the newly created node and its file
                  setSelectedNode(node);
                  setIsConfigOpen(true);
                  setSelectedFile(filename);
                  setEditorContent(initialContent);
                  setEditorLanguage(language);
                }}
              />
            )}
            
            {activeTab === 'code' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 relative">
                  <CodeEditor 
                    value={editorContent} 
                    onChange={(val) => handleEditorChange(val || '')} 
                    language={editorLanguage}
                    filename={selectedFile}
                  />
                </div>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="w-full h-full flex bg-[#f3f4f6] overflow-hidden">
                
                {/* Left Side: Interactive Input Panel */}
                <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm z-10">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">测试你的应用</h3>
                  <p className="text-sm text-gray-500 mb-6">通过下方输入框或上传图片，动态触发 Agent 流程，并查看右侧结果更新。</p>
                  
                  <div className="flex flex-col gap-4 flex-1">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">产品描述或灵感 (Input Text)</label>
                      <textarea 
                        className="w-full h-32 p-3 border border-gray-300 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        placeholder="例如：一款蓝色的挂耳式蓝牙耳机，主打运动防水和超长续航..."
                        value={userChatInput}
                        onChange={(e) => setUserChatInput(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">产品图片 (Vision Input)</label>
                      <div 
                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadedImage ? (
                          <img src={uploadedImage} alt="Uploaded" className="h-full object-contain p-2" />
                        ) : (
                          <>
                            <span className="text-2xl mb-2">📸</span>
                            <span className="text-xs text-gray-500">点击上传产品图片</span>
                          </>
                        )}
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleUserSubmit}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg mt-6 transition-colors shadow-md"
                  >
                    生成卡片 (Generate)
                  </button>
                </div>

                {/* Right Side: Mock UI Preview */}
                <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
                  <LiveProvider 
                    code={files['src/ui/SocialMediaCard.tsx']?.content || ''}
                    scope={{ 
                      React,
                      title: JSON.parse(files['src/data/Output_3.json']?.content || '{}')?.data?.title,
                      copywriting: JSON.parse(files['src/data/Output_3.json']?.content || '{}')?.data?.copywriting,
                      image: uploadedImage
                    }}
                    noInline={true}
                  >
                    <LivePreview />
                    <LiveError className="text-red-500 text-xs mt-4" />
                  </LiveProvider>
                </div>

              </div>
            )}
          </div>
          
          {/* Right Sidebar: Agent Config & Terminal */}
          {activeTab === 'flow' && isConfigOpen && (
            <div className="w-96 bg-[#252526] flex flex-col shrink-0">
              {/* Config Header */}
              <div className="h-12 bg-[#2d2d2d] flex items-center px-4 justify-between font-semibold text-sm border-b border-[#3c3c3c]">
                <div className="flex items-center gap-2">
                  <Settings size={16} />
                  <span>Config: {selectedNode ? selectedNode.data.label : 'No node selected'}</span>
                </div>
                <button 
                  onClick={() => setIsConfigOpen(false)}
                  className="p-1 hover:bg-[#3c3c3c] rounded text-gray-400 hover:text-white transition-colors"
                  title="Close Config"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Prompt/Code Tabs */}
              <div className="flex-1 flex flex-col min-h-[50%] border-b border-[#3c3c3c]">
                <div className="flex bg-[#1e1e1e] text-xs text-gray-400 font-semibold tracking-wider border-b border-[#3c3c3c]">
                  <button 
                    onClick={() => setConfigTab('prompt')}
                    className={`flex-1 py-2 text-center transition-colors ${configTab === 'prompt' ? 'bg-[#2d2d2d] text-white border-t-2 border-[#aa3bff]' : 'hover:bg-[#252526] border-t-2 border-transparent'}`}
                  >
                    PROMPT
                  </button>
                  <button 
                    onClick={() => setConfigTab('code')}
                    className={`flex-1 py-2 text-center transition-colors ${configTab === 'code' ? 'bg-[#2d2d2d] text-white border-t-2 border-[#aa3bff]' : 'hover:bg-[#252526] border-t-2 border-transparent'}`}
                  >
                    CODE
                  </button>
                </div>
                <div className="flex-1 relative">
                  {selectedNode ? (
                    configTab === 'prompt' ? (
                      <div className="w-full h-full flex flex-col">
                        <textarea
                          value={prompts[selectedNode.id] || ''}
                          onChange={(e) => handlePromptChange(selectedNode.id, e.target.value)}
                          className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 resize-none focus:outline-none font-mono text-sm"
                          placeholder="Enter system prompt for this agent...\nUse {variable} to extract parameters."
                        />
                        {/* Dynamic Parameters Panel */}
                        {extractParams(prompts[selectedNode.id] || '').length > 0 && (
                          <div className={`border-t border-[#3c3c3c] bg-[#252526] flex flex-col transition-all duration-300 ${isParamsOpen ? 'h-1/3' : 'h-10 overflow-hidden'}`}>
                            <div 
                              className="text-xs text-gray-400 font-semibold p-3 flex items-center justify-between cursor-pointer hover:text-white hover:bg-[#3c3c3c]"
                              onClick={() => setIsParamsOpen(!isParamsOpen)}
                            >
                              <span>DYNAMIC PARAMETERS (Variables)</span>
                              {isParamsOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                            </div>
                            {isParamsOpen && (
                              <div className="flex flex-col gap-2 px-4 pb-4 overflow-y-auto flex-1">
                                {extractParams(prompts[selectedNode.id] || '').map(param => (
                                  <div key={param} className="flex flex-col gap-1 shrink-0">
                                    <label className="text-xs text-blue-400 font-mono">{`{${param}}`}</label>
                                    <input 
                                      type="text" 
                                      className="bg-[#1e1e1e] border border-[#3c3c3c] rounded p-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                                      placeholder={`Set test value for ${param}...`}
                                      value={nodeParams[selectedNode.id]?.[param] || ''}
                                      onChange={(e) => handleParamChange(selectedNode.id, param, e.target.value)}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <CodeEditor 
                        value={files[selectedFile || '']?.content || '// No file linked'} 
                        onChange={(val) => handleEditorChange(val || '')} 
                        language={files[selectedFile || '']?.language || 'plaintext'}
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm bg-[#1e1e1e]">
                      Select an agent node to edit
                    </div>
                  )}
                </div>
              </div>

              {/* Terminal */}
              <div className={`shrink-0 flex flex-col bg-[#1e1e1e] transition-all duration-300 border-t border-[#3c3c3c] ${isLogsOpen ? 'h-64' : 'h-10 overflow-hidden'}`}>
                <div 
                  className="p-2.5 bg-[#1e1e1e] text-xs text-gray-400 font-semibold tracking-wider flex items-center justify-between cursor-pointer hover:text-white hover:bg-[#2d2d2d]"
                  onClick={() => setIsLogsOpen(!isLogsOpen)}
                >
                  <div className="flex items-center gap-2"><TerminalSquare size={14} /> LOGS</div>
                  {isLogsOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                </div>
                {isLogsOpen && (
                  <div className="flex-1 overflow-hidden border-t border-[#3c3c3c]">
                    <TerminalPanel output={output} />
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  )
}

export default App