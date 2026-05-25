"use client";

import type { AnalysisResponse } from "@/lib/api";

interface ScoreCardProps {
  results: AnalysisResponse;
}

function CircleScore({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 80 ? "var(--green)" : score >= 50 ? "var(--yellow)" : "var(--red)";

  return (
    <div style={{ position: "relative", width: 96, height: 96 }}>
      <svg width="96" height="96" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="48"
          cy="48"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{ transition: "all 1s ease", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: "1.2rem",
            color,
          }}
        >
          {Math.round(score)}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.5rem",
            color: "var(--text-muted)",
            letterSpacing: "0.05em",
          }}
        >
          /100
        </span>
      </div>
    </div>
  );
}

function StatBox({
  value,
  label,
  color,
  icon,
}: {
  value: number | string;
  label: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: "1.8rem",
          color,
          lineHeight: 1,
          marginTop: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6rem",
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function ScoreCard({ results }: ScoreCardProps) {
  const passRate = results.total_passed + results.total_failed > 0
    ? Math.round((results.total_passed / (results.total_passed + results.total_failed)) * 100)
    : 0;

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        marginBottom: 24,
        alignItems: "stretch",
      }}
    >
      {/* Score circle */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "20px 28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          minWidth: 160,
        }}
      >
        <CircleScore score={results.overall_score} />
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6rem",
            color: "var(--text-muted)",
            letterSpacing: "0.1em",
            textAlign: "center",
          }}
        >
          SOLUTION SCORE
        </div>
      </div>

      {/* Stats */}
      <StatBox
        value={results.total_passed + results.total_failed}
        label="Tests Run"
        color="var(--blue)"
        icon="🧪"
      />
      <StatBox
        value={results.total_passed}
        label="Passed"
        color="var(--green)"
        icon="✅"
      />
      <StatBox
        value={results.total_failed}
        label="Failed"
        color="var(--red)"
        icon="❌"
      />
      <StatBox
        value={results.critical_failures}
        label="Critical"
        color="var(--orange)"
        icon="🔥"
      />
      <StatBox
        value={`${passRate}%`}
        label="Pass Rate"
        color={passRate >= 80 ? "var(--green)" : passRate >= 50 ? "var(--yellow)" : "var(--red)"}
        icon="📊"
      />
    </div>
  );
}