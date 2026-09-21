import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

const CodeEditor = ({ code, language, onChange, onCursorChange, remoteCursors }) => {
  const mountedRef = useRef(false);
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const decorationsRef = useRef([]);

  const languageMap = {
    javascript: "javascript",
    python: "python",
    cpp: "cpp",
    java: "java",
  };

  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Track cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      if (!mountedRef.current) return;
      if (!onCursorChange) return;
      onCursorChange({
        lineNumber: e.position.lineNumber,
        column: e.position.column,
      });
    });

    setTimeout(() => {
      mountedRef.current = true;
    }, 100);
  };

  const handleEditorChange = (value) => {
    if (!mountedRef.current) return;
    if (onChange) onChange(value || "");
  };

  // Render remote cursors using Monaco decorations
  useEffect(() => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco || !remoteCursors) return;

    const newDecorations = [];

    Object.entries(remoteCursors).forEach(([userId, cursor]) => {
      if (!cursor || !cursor.position) return;
      const { lineNumber, column } = cursor.position;
      if (!lineNumber || !column) return;

      newDecorations.push({
        range: new monaco.Range(lineNumber, column, lineNumber, column),
        options: {
          isWholeLine: false,
          className: "remote-cursor",
          glyphMarginClassName: "remote-cursor-glyph",
          hoverMessage: { value: `**${cursor.name}**` },
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      });

      // Add a label decoration with the user's name
      newDecorations.push({
        range: new monaco.Range(lineNumber, column, lineNumber, column),
        options: {
          isWholeLine: false,
          after: {
            content: ` ${cursor.name}`,
            inlineClassName: "remote-cursor-label",
          },
        },
      });
    });

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [remoteCursors]);

  return (
    <div className="border border-line bg-[#1e1e1e]">
      <style>{`
        .remote-cursor {
          border-left: 2px solid #f59e0b !important;
          margin-left: -1px;
        }
        .remote-cursor-label {
          background: #f59e0b;
          color: #0a0e1a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          padding: 0 4px;
          border-radius: 2px;
          margin-left: 2px;
        }
      `}</style>
      <Editor
        height="500px"
        language={languageMap[language] || "javascript"}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
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
