"use client";

import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useSyncExternalStore } from "react";
import { CheckCircle2, Clock, Send } from "lucide-react";

import { Badge } from "@/components/ui/shadcn/badge";
import { Button } from "@/components/ui/shadcn/button";
import { cn } from "@/lib/utils";

const DEMO_REQUEST = `GET /v1/forecast?latitude=52.52&longitude=13.41&current_weather=true
Host: api.open-meteo.com
Accept: application/json`;

const DEMO_RESPONSE = `{
  "latitude": 52.52,
  "longitude": 13.41,
  "generationtime_ms": 0.214,
  "current_weather": {
    "temperature": 18.4,
    "windspeed": 12.1,
    "winddirection": 218,
    "weathercode": 2,
    "time": "2026-07-27T12:00"
  }
}`;

const EDITOR_HEIGHT = "320px";

const panelHeaderClass =
  "flex h-11 shrink-0 items-center justify-between gap-2 border-b border-border px-3 sm:px-4";

const editorTypography = EditorView.theme({
  "&": {
    fontSize: "inherit",
    lineHeight: "1.625",
  },
  ".cm-content": {
    padding: "0.875rem 1rem",
    fontFamily: "inherit",
  },
  ".cm-scroller": {
    fontFamily: "inherit",
  },
  ".cm-line": {
    padding: "0",
  },
});

const codeMirrorClassName = cn(
  "w-full min-w-0 text-base leading-relaxed sm:text-lg",
  "[&_.cm-editor]:bg-transparent [&_.cm-editor]:outline-none",
  "[&_.cm-scroller]:font-mono [&_.cm-content]:font-mono",
  "[&_.cm-scroller]:overflow-x-hidden",
);

function subscribeToColorScheme(onStoreChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getColorSchemeSnapshot() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getColorSchemeServerSnapshot() {
  return false;
}

export function TesterPreview() {
  const isDark = useSyncExternalStore(
    subscribeToColorScheme,
    getColorSchemeSnapshot,
    getColorSchemeServerSnapshot,
  );

  const editorTheme = isDark ? oneDark : "light";
  const wrapExtension = EditorView.lineWrapping;

  return (
    <div className="relative min-w-0 w-full">
      <div className="absolute -inset-2 rounded-3xl bg-primary/10 blur-3xl" />
      <div className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xl shadow-primary/5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/40 px-3 py-3 sm:px-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-red-400/90" />
            <div className="size-2.5 rounded-full bg-amber-400/90" />
            <div className="size-2.5 rounded-full bg-emerald-400/90" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Open-Meteo · in-browser tester
          </span>
          <Badge variant="secondary" className="text-xs uppercase tracking-wider">
            Live preview
          </Badge>
        </div>

        <div className="grid min-w-0 grid-cols-2 divide-x divide-border">
          <div className="flex min-w-0 flex-col">
            <div className={panelHeaderClass}>
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Request
              </span>
              <Button size="sm" className="h-8 shrink-0 gap-1.5 px-2.5 text-sm" disabled>
                <Send className="size-3.5" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </div>
            <CodeMirror
              value={DEMO_REQUEST}
              height={EDITOR_HEIGHT}
              theme={editorTheme}
              extensions={[wrapExtension, editorTypography]}
              editable={false}
              basicSetup={{
                lineNumbers: false,
                foldGutter: false,
                highlightActiveLine: false,
              }}
              className={codeMirrorClassName}
            />
          </div>

          <div className="flex min-w-0 flex-col">
            <div className={panelHeaderClass}>
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Response
              </span>
              <div className="flex h-8 shrink-0 items-center gap-2 text-sm text-muted-foreground sm:gap-2.5">
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle2 className="size-3.5 shrink-0 text-primary" />
                  200 OK
                </span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Clock className="size-3.5 shrink-0" />
                  142 ms
                </span>
              </div>
            </div>
            <CodeMirror
              value={DEMO_RESPONSE}
              height={EDITOR_HEIGHT}
              theme={editorTheme}
              extensions={[json(), wrapExtension, editorTypography]}
              editable={false}
              basicSetup={{
                lineNumbers: false,
                foldGutter: false,
                highlightActiveLine: false,
              }}
              className={codeMirrorClassName}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-3 py-3 sm:px-4">
          <Badge variant="outline" className="text-sm font-normal">
            Trust score 92
          </Badge>
          <Badge variant="outline" className="text-sm font-normal">
            No auth required
          </Badge>
          <Badge variant="outline" className="text-sm font-normal">
            CORS-friendly
          </Badge>
        </div>
      </div>
    </div>
  );
}
