import React from "react";
import MonacoEditor from "@monaco-editor/react";

export default function CodeEditor({ value, language, onChange }) {
  return (
    <div className="h-48 w-full border rounded overflow-hidden">
      <MonacoEditor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          wordWrap: "on",
        }}
      />
    </div>
  );
} 