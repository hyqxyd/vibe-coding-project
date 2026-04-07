import React from 'react';
import { Folder, FileText, FileJson, FileCode2, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  icon?: React.ReactNode;
  children?: FileNode[];
}

const MOCK_FILES: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'agents',
        type: 'folder',
        children: [
          { name: 'DataProcessor.py', type: 'file', icon: <FileCode2 size={14} className="text-blue-400" /> },
          { name: 'OutputGenerator.py', type: 'file', icon: <FileCode2 size={14} className="text-blue-400" /> },
        ]
      },
      {
        name: 'frontend',
        type: 'folder',
        children: [
          { name: 'App.tsx', type: 'file', icon: <FileCode2 size={14} className="text-blue-400" /> },
          { name: 'styles.css', type: 'file', icon: <FileCode2 size={14} className="text-blue-400" /> },
        ]
      },
      { name: 'main.go', type: 'file', icon: <FileCode2 size={14} className="text-blue-400" /> },
      { name: 'config.json', type: 'file', icon: <FileJson size={14} className="text-yellow-400" /> },
    ]
  },
  { name: 'README.md', type: 'file', icon: <FileText size={14} className="text-gray-400" /> },
];

export function FileExplorer() {
  const renderTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node, index) => (
      <div key={index} className="flex flex-col">
        <div 
          className="flex items-center gap-1.5 py-1 px-2 hover:bg-[#37373d] cursor-pointer text-sm text-gray-300"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          {node.type === 'folder' ? (
            <ChevronRight size={14} className="text-gray-400" />
          ) : (
            <span className="w-3.5" /> // Spacer for alignment
          )}
          {node.type === 'folder' ? <Folder size={14} className="text-blue-300" /> : node.icon}
          <span className="truncate">{node.name}</span>
        </div>
        {node.children && renderTree(node.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="w-60 bg-[#252526] border-r border-[#3c3c3c] flex flex-col h-full shrink-0">
      <div className="h-8 flex items-center px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {renderTree(MOCK_FILES)}
      </div>
    </div>
  );
}