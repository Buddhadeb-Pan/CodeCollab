import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, language, onChange }) => {
  const languageMap = {
    javascript: "javascript",
    python: "python",
    cpp: "cpp",
    java: "java",
  };

  const handleEditorChange = (value) => {
    if (onChange) onChange(value || "");
  };

  return (
    <div className="border border-line bg-[#1e1e1e]">
      <Editor
        height="500px"
        language={languageMap[language] || "javascript"}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 16, bottom: 16 },
          lineNumbersMinChars: 3,
          renderLineHighlight: "all",
          cursorBlinking: "smooth",
          smoothScrolling: true,
        }}
        loading={
          <div className="flex items-center justify-center h-[500px] font-mono text-sm text-muted">
            <span className="text-amber">$</span> loading_editor...
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
