"use client";

import { useState } from "react";
import type { TestCase, ExecutionResult, FailureAnalysis } from "@/lib/api";

interface TestCaseGridProps {
  testCases: TestCase[];
  resultMap: Record<string, ExecutionResult>;
  analysisMap: Record<string, FailureAnalysis>;
}

function TypeBadge({ type }: { type: TestCase["type"] }) {
  const labels: Record<TestCase["type"], string> = {
    basic: "BASIC",
    edge: "EDGE",
    hidden: "HIDDEN",
    stress: "STRESS",
    adversarial: "ADVERSARIAL",
  };
  return (
    <span className={`badge badge-${type}`}>{labels[type]}</span>
  );
}

function RiskBadge({ risk }: { risk: TestCase["risk_level"] }) {
  const icons: Record<string, string> = {
    low: "🟢",
    medium: "🟡",
    high: "🟠",
    critical: "🔴",
  };
  return (
    <span className={`badge badge-${risk}`}>
      {icons[risk]} {risk.toUpperCase()}
    </span>
  );
}

export default function TestCaseGrid({ testCases, resultMap, analysisMap }: TestCaseGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "passed" | "failed">("all");

  const filtered = testCases.filter((tc) => {
    const result = resultMap[tc.id];
    if (filter === "passed") return result?.passed;
    if (filter === "failed") return result && !result.passed;
    return true;
  });

  const selectedTc = testCases.find((tc) => tc.id === selected);
  const selectedResult = selected ? resultMap[selected] : null;
  const selectedAnalysis = selected ? analysisMap[selected] : null;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.65rem",
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
          }}
        >
          🧪 TEST CASES ({testCases.length})
        </span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["all", "passed", "failed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "3px 10px",
                borderRadius: 4,
                border: "1px solid",
                borderColor: filter === f ? "var(--accent)" : "var(--border)",
                background: filter === f ? "var(--accent-glow)" : "transparent",
                color: filter === f ? "var(--accent-bright)" : "var(--text-dim)",
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                cursor: "pointer",
                textTransform: "capitalize",
                letterSpacing: "0.05em",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* List */}
        <div
          style={{
            width: 240,
            borderRight: "1px solid var(--border)",
            overflowY: "auto",
            flexShrink: 0,
          }}
        >
          {filtered.map((tc) => {
            const result = resultMap[tc.id];
            const passed = result?.passed;
            const hasError = result?.error;
            const isSelected = selected === tc.id;

            return (
              <div
                key={tc.id}
                onClick={() => setSelected(isSelected ? null : tc.id)}
                style={{
                  padding: "10px 14px",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  background: isSelected ? "var(--bg-elevated)" : "transparent",
                  borderLeft: `3px solid ${
                    passed ? "var(--green)" : result ? "var(--red)" : "var(--border)"
                  }`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "var(--bg-elevated)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontSize: 12 }}>
                    {!result ? "⏸" : passed ? "✅" : hasError ? "💥" : "❌"}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: "var(--text-dim)",
                    }}
                  >
                    {tc.id}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    color: "var(--text)",
                    marginBottom: 4,
                    lineHeight: 1.3,
                  }}
                >
                  {tc.description}
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <TypeBadge type={tc.type} />
                </div>
                {result && (
                  <div
                    style={{
                      marginTop: 4,
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.55rem",
                      color: "var(--text-dim)",
                    }}
                  >
                    {result.execution_time_ms.toFixed(1)}ms
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Detail panel */}
        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {selectedTc ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* TC header */}
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    marginBottom: 6,
                  }}
                >
                  {selectedTc.description}
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <TypeBadge type={selectedTc.type} />
                  <RiskBadge risk={selectedTc.risk_level} />
                  {selectedResult && (
                    <span
                      className="badge"
                      style={{
                        background: selectedResult.passed ? "var(--green-dim)" : "var(--red-dim)",
                        color: selectedResult.passed ? "var(--green)" : "var(--red)",
                      }}
                    >
                      {selectedResult.passed ? "✓ PASSED" : "✗ FAILED"}
                    </span>
                  )}
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <div className="label">WHY THIS MIGHT FAIL</div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.72rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    background: "var(--bg)",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                  }}
                >
                  {selectedTc.reasoning}
                </p>
              </div>

              {/* Input */}
              <div>
                <div className="label">INPUT</div>
                <div className="code-block">{selectedTc.input}</div>
              </div>

              {/* Expected */}
              {selectedTc.expected_output && (
                <div>
                  <div className="label">EXPECTED OUTPUT</div>
                  <div className="code-block" style={{ color: "var(--green)" }}>
                    {selectedTc.expected_output}
                  </div>
                </div>
              )}

              {/* Actual */}
              {selectedResult && (
                <div>
                  <div className="label">ACTUAL OUTPUT</div>
                  <div
                    className="code-block"
                    style={{
                      color: selectedResult.passed ? "var(--green)" : "var(--red)",
                      borderColor: selectedResult.passed ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
                    }}
                  >
                    {selectedResult.error
                      ? `ERROR: ${selectedResult.error}`
                      : selectedResult.actual_output || "(empty)"}
                  </div>
                </div>
              )}

              {/* Analysis */}
              {selectedAnalysis && (
                <div
                  style={{
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid var(--red)",
                    background: "var(--red-dim)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: "var(--red)",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    🐛 BUG ANALYSIS · {selectedAnalysis.bug_category.toUpperCase()}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      color: "var(--text)",
                      lineHeight: 1.6,
                      marginBottom: 8,
                    }}
                  >
                    {selectedAnalysis.failure_reason}
                  </p>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.6rem",
                      color: "var(--yellow)",
                      letterSpacing: "0.08em",
                      marginBottom: 4,
                    }}
                  >
                    💡 FIX SUGGESTION
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedAnalysis.fix_suggestion}
                  </p>
                  {selectedAnalysis.code_snippet && (
                    <div className="code-block" style={{ marginTop: 8, color: "#a5b4fc" }}>
                      {selectedAnalysis.code_snippet}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-dim)",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 32 }}>👈</div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.05em",
                }}
              >
                SELECT A TEST CASE
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .label {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--text-dim);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
}