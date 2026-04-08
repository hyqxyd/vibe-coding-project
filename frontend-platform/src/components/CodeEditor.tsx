import React from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  filename?: string;
}

export function CodeEditor({ value, onChange, language = 'javascript', filename }: CodeEditorProps) {
  const handleEditorWillMount = (monaco: any) => {
    // Configure TypeScript to understand React JSX
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.Latest,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e]">
      {filename && (
        <div className="h-10 bg-[#252526] flex items-center px-4 text-sm text-gray-300 border-b border-[#3c3c3c]">
          <div className="flex items-center gap-2">
            <span className="text-[#e2c08d]">{ }</span> {filename}
          </div>
        </div>
      )}
      <div className="flex-grow">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          onChange={onChange}
          beforeMount={handleEditorWillMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>
    </div>
  );
}