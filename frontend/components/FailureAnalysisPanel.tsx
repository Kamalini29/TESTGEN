"use client";

import type { FailureAnalysis, TestCase } from "@/lib/api";

interface FailureAnalysisPanelProps {
  failureAnalyses: FailureAnalysis[];
  testCases: TestCase[];
}

const BUG_ICONS: Record<string, string> = {
  "off-by-one": "🔢",
  "integer-overflow": "💥",
  "wrong-logic": "🔀",
  "missing-edge-case": "🕳",
  "array-bounds": "📏",
  "infinite-loop": "🔁",
  "type-error": "🔤",
  other: "🐛",
};

const BUG_COLORS: Record<string, string> = {
  "off-by-one": "#60a5fa",
  "integer-overflow": "#f87171",
  "wrong-logic": "#c084fc",
  "missing-edge-case": "#fbbf24",
  "array-bounds": "#fb923c",
  "infinite-loop": "#f87171",
  "type-error": "#34d399",
  other: "var(--text-muted)",
};

export default function FailureAnalysisPanel({
  failureAnalyses,
  testCases,
}: FailureAnalysisPanelProps) {
  const tcMap = Object.fromEntries(testCases.map((tc) => [tc.id, tc]));

  if (failureAnalyses.length === 0) {
    return (
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--green)",
          borderRadius: 12,
          padding: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          minHeight: 160,
        }}
      >
        <div style={{ fontSize: 36 }}>🎉</div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1.1rem",
            color: "var(--green)",
          }}
        >
          No Failures Detected
        </div>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          Your solution passed all generated test cases.
          <br />
          Consider testing with more extreme constraints.
        </p>
      </div>
    );
  }

  // Bug category breakdown
  const bugCounts: Record<string, number> = {};
  failureAnalyses.forEach((fa) => {
    bugCounts[fa.bug_category] = (bugCounts[fa.bug_category] || 0) + 1;
  });

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
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
          🐛 FAILURE ANALYSIS ({failureAnalyses.length})
        </span>
      </div>

      {/* Bug breakdown */}
      {Object.keys(bugCounts).length > 0 && (
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {Object.entries(bugCounts).map(([cat, count]) => (
            <div
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 20,
                border: "1px solid var(--border-bright)",
                background: "var(--bg-elevated)",
              }}
            >
              <span style={{ fontSize: 12 }}>{BUG_ICONS[cat] || "🐛"}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: BUG_COLORS[cat] || "var(--text-muted)",
                }}
              >
                {cat}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: "var(--text-dim)",
                }}
              >
                ×{count}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Failure list */}
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {failureAnalyses.map((fa, idx) => {
          const tc = tcMap[fa.test_case_id];
          return (
            <div
              key={fa.test_case_id}
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid var(--border)",
                animation: `slide-up 0.4s ease ${idx * 0.05}s both`,
              }}
            >
              {/* Top row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>
                  {BUG_ICONS[fa.bug_category] || "🐛"}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    color: "var(--text)",
                  }}
                >
                  {tc?.description || fa.test_case_id}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    padding: "2px 8px",
                    borderRadius: 4,
                    color: BUG_COLORS[fa.bug_category] || "var(--text-muted)",
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {fa.bug_category}
                </span>
              </div>

              {/* Reason */}
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.6,
                  marginBottom: 8,
                }}
              >
                {fa.failure_reason}
              </p>

              {/* Fix */}
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 6,
                  background: "rgba(245,158,11,0.08)",
                  border: "1px solid rgba(245,158,11,0.2)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.6rem",
                    color: "var(--yellow)",
                    letterSpacing: "0.08em",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  💡 FIX
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {fa.fix_suggestion}
                </span>
              </div>

              {/* Code snippet */}
              {fa.code_snippet && (
                <div className="code-block" style={{ marginTop: 8, color: "#a5b4fc" }}>
                  {fa.code_snippet}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}