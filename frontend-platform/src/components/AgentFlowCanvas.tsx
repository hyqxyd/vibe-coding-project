import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  { 
    id: '1', 
    position: { x: 250, y: 100 }, 
    data: { label: 'User Input' },
    type: 'input'
  },
  { 
    id: '2', 
    position: { x: 250, y: 250 }, 
    data: { label: 'Data Processing Agent' },
  },
  { 
    id: '3', 
    position: { x: 250, y: 400 }, 
    data: { label: 'Final Output UI' },
    type: 'output'
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3' },
];

interface AgentFlowCanvasProps {
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
}

export function AgentFlowCanvas({ onNodeClick }: AgentFlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-full bg-[#1e1e1e]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        colorMode="dark"
      >
        <Controls />
        <MiniMap nodeStrokeColor="#555" nodeColor="#333" maskColor="#111" />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#444" />
      </ReactFlow>
    </div>
  );
}