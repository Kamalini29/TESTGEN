"use client";

import type { ComplexityInsight } from "@/lib/api";

interface ComplexityPanelProps {
  insight: ComplexityInsight;
}

function ComplexityBadge({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        flex: 1,
        padding: "12px 16px",
        borderRadius: 8,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "1rem",
          color: "var(--accent-bright)",
          marginBottom: 4,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.55rem",
          color: "var(--text-dim)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function ConfidenceBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--text-dim)",
            letterSpacing: "0.08em",
          }}
        >
          AI CONFIDENCE
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color,
            fontWeight: 700,
          }}
        >
          {Math.round(score)}%
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "var(--bg)",
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: 3,
            transition: "width 1s ease",
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

export default function ComplexityPanel({ insight }: ComplexityPanelProps) {
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
          ⚡ PERFORMANCE INSIGHTS
        </span>
      </div>

      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Complexity badges */}
        <div style={{ display: "flex", gap: 10 }}>
          <ComplexityBadge label="Time Complexity" value={insight.time_complexity} />
          <ComplexityBadge label="Space Complexity" value={insight.space_complexity} />
        </div>

        {/* Confidence */}
        <ConfidenceBar score={insight.confidence_score} />

        {/* Bottleneck */}
        {insight.bottleneck && (
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "var(--text-dim)",
                letterSpacing: "0.08em",
                marginBottom: 6,
              }}
            >
              BOTTLENECK
            </div>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
                padding: "8px 12px",
                background: "var(--bg)",
                borderRadius: 6,
                border: "1px solid var(--border)",
              }}
            >
              {insight.bottleneck}
            </p>
          </div>
        )}

        {/* Optimization suggestions */}
        {insight.optimization_suggestions.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                color: "var(--text-dim)",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              OPTIMIZATION SUGGESTIONS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {insight.optimization_suggestions.map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "8px 12px",
                    background: "var(--bg)",
                    borderRadius: 6,
                    border: "1px solid var(--border)",
                    animation: `slide-up 0.3s ease ${i * 0.08}s both`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.65rem",
                      color: "var(--accent-bright)",
                      flexShrink: 0,
                      fontWeight: 700,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}