"use client";

import { javascript } from "@codemirror/lang-javascript";
import { json } from "@codemirror/lang-json";
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language";
import { shell } from "@codemirror/legacy-modes/mode/shell";
import { oneDark } from "@codemirror/theme-one-dark";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";

export type CodeBlockLanguage = "javascript" | "python" | "shell" | "json" | "text";

interface CodeBlockProps {
  code: string;
  language?: CodeBlockLanguage;
  className?: string;
  minHeight?: string;
}

function languageExtension(language: CodeBlockLanguage) {
  switch (language) {
    case "javascript":
      return javascript();
    case "python":
      return python();
    case "json":
      return json();
    case "shell":
      return StreamLanguage.define(shell);
    default:
      return [];
  }
}

export function CodeBlock({
  code,
  language = "text",
  className,
  minHeight = "8rem",
}: CodeBlockProps) {
  const extensions = useMemo(() => [languageExtension(language)], [language]);

  return (
    <div
      className={`min-w-0 overflow-hidden rounded-lg border border-border bg-[#282c34] ${className ?? ""}`}
    >
      <CodeMirror
        value={code}
        extensions={extensions}
        theme={oneDark}
        editable={false}
        basicSetup={{
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: false,
          highlightSelectionMatches: false,
        }}
        minHeight={minHeight}
        className="text-sm [&_.cm-editor]:bg-transparent [&_.cm-gutters]:border-r [&_.cm-gutters]:border-white/10 [&_.cm-gutters]:bg-[#21252b] [&_.cm-scroller]:overflow-auto"
      />
    </div>
  );
}
