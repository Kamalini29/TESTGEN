"use client";

import { useState, useEffect, useRef } from "react";
import type { RunRequest } from "@/lib/api";

interface InputPanelProps {
  onRun: (req: RunRequest) => void;
  error: string | null;
  exampleProblem: string;
  exampleCode: string;
}

const PLATFORMS = ["general", "leetcode", "hackerrank", "codeforces"];
const LANGUAGES = [
  { value: "python", label: "Python 3" },
  { value: "cpp", label: "C++ (preview)" },
  { value: "java", label: "Java (preview)" },
];

export default function InputPanel({ onRun, error, exampleProblem, exampleCode }: InputPanelProps) {
  const [problem, setProblem] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<"python" | "cpp" | "java">("python");
  const [platform, setPlatform] = useState("general");
  const [isReady, setIsReady] = useState(false);
  const codeRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsReady(problem.trim().length > 20 && code.trim().length > 10);
  }, [problem, code]);

  const handleLoadExample = () => {
    setProblem(exampleProblem);
    setCode(exampleCode);
  };

  const handleRun = () => {
    if (!isReady) return;
    onRun({ problem_statement: problem, solution_code: code, language, platform });
  };

  const handleTabInCode = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      setTimeout(() => {
        if (codeRef.current) {
          codeRef.current.selectionStart = start + 4;
          codeRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "32px 24px",
        animation: "slide-up 0.4s ease forwards",
      }}
    >
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div
          style={{
            display: "inline-block",
            padding: "4px 16px",
            borderRadius: 20,
            border: "1px solid var(--accent)",
            background: "var(--accent-glow)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--accent-bright)",
            letterSpacing: "0.15em",
            marginBottom: 16,
          }}
        >
          POWERED BY GPT-4o + SECURE SANDBOX
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            marginBottom: 12,
          }}
        >
          Break Your Code
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, var(--accent-bright), #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Before Tests Do
          </span>
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "1rem",
            fontFamily: "var(--font-mono)",
            maxWidth: 500,
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          AI generates adversarial edge cases, executes them, finds failures,
          and explains why your solution breaks.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            marginBottom: 20,
            padding: "12px 16px",
            borderRadius: 8,
            background: "var(--red-dim)",
            border: "1px solid var(--red)",
            color: "var(--red)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {/* Platform */}
        <div style={{ display: "flex", gap: 4 }}>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: platform === p ? "var(--accent)" : "var(--border)",
                background: platform === p ? "var(--accent-glow)" : "transparent",
                color: platform === p ? "var(--accent-bright)" : "var(--text-muted)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                cursor: "pointer",
                letterSpacing: "0.05em",
                textTransform: "capitalize",
                transition: "all 0.15s",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Language */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as any)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--bg-card)",
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        {/* Load Example */}
        <button
          onClick={handleLoadExample}
          style={{
            marginLeft: "auto",
            padding: "6px 16px",
            borderRadius: 6,
            border: "1px solid var(--border-bright)",
            background: "transparent",
            color: "var(--text-muted)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            cursor: "pointer",
            letterSpacing: "0.05em",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.color = "var(--accent-bright)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-bright)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          LOAD EXAMPLE →
        </button>
      </div>

      {/* Main Input Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Problem Statement */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
            transition: "border-color 0.2s",
          }}
          onFocusCapture={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-bright)")
          }
          onBlurCapture={(e) =>
            (e.currentTarget.style.borderColor = "var(--border)")
          }
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14 }}>📋</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
              }}
            >
              PROBLEM STATEMENT
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "var(--text-dim)",
              }}
            >
              {problem.length} chars
            </span>
          </div>
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Paste your LeetCode / Codeforces problem statement here..."
            style={{
              width: "100%",
              minHeight: 320,
              padding: 16,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "var(--text)",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8rem",
              lineHeight: 1.7,
              resize: "vertical",
            }}
          />
        </div>

        {/* Code Editor */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14 }}>💻</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                letterSpacing: "0.1em",
              }}
            >
              YOUR SOLUTION ({language.toUpperCase()})
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "var(--text-dim)",
              }}
            >
              {code.split("\n").length} lines
            </span>
          </div>
          <div style={{ position: "relative" }}>
            {/* Line numbers */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 40,
                padding: "16px 0",
                height: "100%",
                background: "rgba(0,0,0,0.2)",
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0,
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              {code.split("\n").map((_, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--text-dim)",
                    lineHeight: "1.7",
                    padding: "0 4px",
                    minWidth: 28,
                    textAlign: "right",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <textarea
              ref={codeRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTabInCode}
              placeholder="# Paste your solution code here..."
              spellCheck={false}
              style={{
                width: "100%",
                minHeight: 320,
                padding: "16px 16px 16px 56px",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#a5b4fc",
                fontFamily: "var(--font-mono)",
                fontSize: "0.8rem",
                lineHeight: 1.7,
                resize: "vertical",
                tabSize: 4,
              }}
            />
          </div>
        </div>
      </div>

      {/* Run Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          onClick={handleRun}
          disabled={!isReady}
          style={{
            padding: "14px 48px",
            borderRadius: 10,
            border: "none",
            background: isReady
              ? "linear-gradient(135deg, var(--accent), #3b82f6)"
              : "var(--bg-elevated)",
            color: isReady ? "white" : "var(--text-dim)",
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1rem",
            letterSpacing: "-0.01em",
            cursor: isReady ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: isReady ? "0 0 30px var(--accent-glow)" : "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
          onMouseEnter={(e) => {
            if (isReady) e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <span style={{ fontSize: 20 }}>⚡</span>
          Break My Code
        </button>
      </div>

      {/* Hint */}
      {!isReady && (
        <p
          style={{
            textAlign: "center",
            marginTop: 12,
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-dim)",
            letterSpacing: "0.05em",
          }}
        >
          ADD PROBLEM + CODE TO CONTINUE
        </p>
      )}
    </div>
  );
}