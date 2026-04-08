import React, { useEffect, useRef } from 'react';

interface TerminalPanelProps {
  output: string;
}

export function TerminalPanel({ output }: TerminalPanelProps) {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div 
      ref={terminalRef}
      className="w-full h-full bg-[#1e1e1e] text-[#cccccc] font-mono text-xs p-3 overflow-y-auto break-words whitespace-pre-wrap leading-relaxed"
      style={{ maxHeight: '100%' }}
    >
      {output}
    </div>
  );
}