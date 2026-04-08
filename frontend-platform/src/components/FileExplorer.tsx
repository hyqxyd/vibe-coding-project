import React, { useState } from 'react';
import { Folder, FolderOpen, FileText, FileJson, FileCode2, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  icon?: React.ReactNode;
  children?: FileNode[];
  path?: string;
}



interface FileExplorerProps {
  onFileSelect?: (fileName: string) => void;
  activeFile?: string;
  files?: Record<string, any>;
}

export function FileExplorer({ onFileSelect, activeFile, files = {} }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/agents', 'src/frontend']));

  // Generate dynamic file list based on passed files
  const buildTree = (filePaths: string[]) => {
    const root: FileNode[] = [];

    filePaths.forEach(path => {
      const parts = path.split('/');
      let currentLevel = root;

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        let existingNode = currentLevel.find(n => n.name === part);

        if (!existingNode) {
          if (isFile) {
            let icon = <FileText size={14} className="text-gray-400" />;
            if (part.endsWith('.py')) icon = <FileCode2 size={14} className="text-blue-400" />;
            if (part.endsWith('.go')) icon = <FileCode2 size={14} className="text-cyan-400" />;
            if (part.endsWith('.tsx') || part.endsWith('.ts')) icon = <FileCode2 size={14} className="text-pink-400" />;
            if (part.endsWith('.css')) icon = <FileCode2 size={14} className="text-blue-400" />;
            if (part.endsWith('.json')) icon = <FileJson size={14} className="text-yellow-400" />;
            
            existingNode = { name: part, type: 'file', icon, path }; // Add path to file node
          } else {
            existingNode = { name: part, type: 'folder', children: [] };
          }
          currentLevel.push(existingNode);
        }
        
        if (!isFile && existingNode.children) {
          currentLevel = existingNode.children;
        }
      });
    });

    return root;
  };

  const tree = buildTree(Object.keys(files));

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTree = (nodes: FileNode[], parentPath = '', depth = 0) => {
    return nodes.map((node) => {
      const currentPath = node.type === 'folder' ? (parentPath ? `${parentPath}/${node.name}` : node.name) : node.path || '';
      const isExpanded = expandedFolders.has(currentPath);
      const isActive = activeFile === currentPath && node.type === 'file';

      return (
        <div key={currentPath} className="flex flex-col">
          <div 
            className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer text-sm select-none
              ${isActive ? 'bg-[#37373d] text-white' : 'text-gray-300 hover:bg-[#2a2d2e]'}`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => {
              if (node.type === 'folder') {
                toggleFolder(currentPath);
              } else if (onFileSelect) {
                onFileSelect(currentPath);
              }
            }}
          >
            {node.type === 'folder' ? (
              isExpanded ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />
            ) : (
              <span className="w-3.5" /> // Spacer for alignment
            )}
            {node.type === 'folder' ? (
              isExpanded ? <FolderOpen size={14} className="text-blue-300" /> : <Folder size={14} className="text-blue-300" />
            ) : node.icon}
            <span className="truncate">{node.name}</span>
          </div>
          {node.children && isExpanded && renderTree(node.children, currentPath, depth + 1)}
        </div>
      );
    });
  };

  return (
    <div className="w-60 bg-[#252526] border-r border-[#3c3c3c] flex flex-col h-full shrink-0">
      <div className="h-8 flex items-center px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {renderTree(tree)}
      </div>
    </div>
  );
}