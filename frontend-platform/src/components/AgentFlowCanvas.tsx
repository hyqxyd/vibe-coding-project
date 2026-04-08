import React, { useCallback, useState } from 'react';
import { Network, PlusCircle, Bot, Layout, FileType2, Webhook, Zap, ArrowRightSquare } from 'lucide-react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from '@xyflow/react';
import type { Connection, Edge, Node, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface AgentFlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onNodesDelete?: (nodes: Node[]) => void;
  onEdgesDelete?: (edges: Edge[]) => void;
  onConnect?: (params: Edge | Connection) => void;
  onNodeAdd?: (node: Node, templateType: string) => void;
}

export function AgentFlowCanvas({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onNodeClick, 
  onNodesDelete, 
  onEdgesDelete, 
  onConnect: externalOnConnect, 
  onNodeAdd 
}: AgentFlowCanvasProps) {

  const addNode = (type: 'agent' | 'ui' | 'data', label: string, templateType: string) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
      data: { label },
      type: type === 'ui' ? 'output' : (type === 'data' ? 'input' : 'default')
    };
    if (onNodeAdd) {
      onNodeAdd(newNode, templateType);
    }
  };

  return (
    <div className="w-full h-full bg-[#1e1e1e] relative">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#2d2d2d] text-gray-300 px-4 py-2 rounded-md text-xs z-10 border border-[#3c3c3c] shadow-lg flex items-center gap-2">
        <Network size={14} className="text-[#aa3bff]" />
        <span>提示：拖拽节点边缘圆点进行连线；选中按 <b>Backspace</b> 解绑；点击节点配置。</span>
      </div>

      {/* Component Library Toolbar */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#252526] border border-[#3c3c3c] rounded-lg shadow-xl z-10 flex flex-col p-2 gap-2">
        <div className="text-[10px] text-gray-400 font-semibold mb-2 text-center border-b border-[#3c3c3c] pb-2">编排组件库</div>
        
        <button 
          onClick={() => addNode('data', 'Input Trigger', 'input_trigger')}
          className="flex flex-col items-center gap-1 p-2 hover:bg-[#3c3c3c] rounded transition-colors text-gray-300"
          title="添加输入/触发器节点"
        >
          <Webhook size={20} className="text-blue-400" />
          <span className="text-[10px] text-center leading-tight mt-1">Input<br/>Trigger</span>
        </button>

        <button 
          onClick={() => addNode('agent', 'AI Agent', 'ai_agent')}
          className="flex flex-col items-center gap-1 p-2 hover:bg-[#3c3c3c] rounded transition-colors text-gray-300"
          title="添加大模型处理节点"
        >
          <Bot size={20} className="text-[#aa3bff]" />
          <span className="text-[10px] text-center leading-tight mt-1">AI<br/>Agent</span>
        </button>

        <button 
          onClick={() => addNode('agent', 'Action Tool', 'action_tool')}
          className="flex flex-col items-center gap-1 p-2 hover:bg-[#3c3c3c] rounded transition-colors text-gray-300"
          title="添加特定任务执行插件"
        >
          <Zap size={20} className="text-yellow-400" />
          <span className="text-[10px] text-center leading-tight mt-1">Action<br/>Tool</span>
        </button>

        <button 
          onClick={() => addNode('ui', 'Output Result', 'output_result')}
          className="flex flex-col items-center gap-1 p-2 hover:bg-[#3c3c3c] rounded transition-colors text-gray-300"
          title="将结果发送给UI或外部"
        >
          <ArrowRightSquare size={20} className="text-pink-400" />
          <span className="text-[10px] text-center leading-tight mt-1">Output<br/>Result</span>
        </button>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={externalOnConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onNodeClick={onNodeClick}
        fitView
        colorMode="dark"
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#444" />
      </ReactFlow>
    </div>
  );
}