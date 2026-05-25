"use client";

import type { AnalysisResponse, RunRequest } from "@/lib/api";
import ScoreCard from "./ScoreCard";
import TestCaseGrid from "./TestCaseGrid";
import FailureAnalysisPanel from "./FailureAnalysisPanel";
import ComplexityPanel from "./ComplexityPanel";

interface ResultsDashboardProps {
  results: AnalysisResponse;
  request: RunRequest;
  onReset: () => void;
}

export default function ResultsDashboard({ results, request, onReset }: ResultsDashboardProps) {
  const resultMap = Object.fromEntries(results.execution_results.map((r) => [r.test_case_id, r]));
  const analysisMap = Object.fromEntries(results.failure_analyses.map((a) => [a.test_case_id, a]));

  const handleDownload = () => {
    const data = {
      problem: request.problem_statement,
      language: request.language,
      test_cases: results.test_cases,
      execution_results: results.execution_results,
      failure_analyses: results.failure_analyses,
      summary: results.summary,
      score: results.overall_score,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "test_cases.json";
    a.click();
  };

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: "24px",
        animation: "slide-up 0.4s ease forwards",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "1.5rem",
              letterSpacing: "-0.02em",
              marginBottom: 4,
            }}
          >
            Analysis Complete
          </h2>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.7rem",
              color: "var(--text-muted)",
            }}
          >
            {results.total_passed + results.total_failed} test cases ·{" "}
            {results.total_passed} passed · {results.total_failed} failed ·{" "}
            {results.critical_failures} critical
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleDownload}
            style={{
              padding: "8px 16px",
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
            ↓ DOWNLOAD JSON
          </button>
          <button
            onClick={onReset}
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: "none",
              background: "linear-gradient(135deg, var(--accent), #3b82f6)",
              color: "white",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "0.8rem",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Test New Code
          </button>
        </div>
      </div>

      {/* Score row */}
      <ScoreCard results={results} />

      {/* AI Summary */}
      <div
        style={{
          marginBottom: 24,
          padding: "16px 20px",
          borderRadius: 10,
          border: "1px solid var(--accent)",
          background: "var(--accent-glow)",
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>🧠</span>
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "var(--accent-bright)",
              letterSpacing: "0.1em",
              marginBottom: 6,
            }}
          >
            AI VERDICT
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.9rem",
              color: "var(--text)",
              lineHeight: 1.6,
            }}
          >
            {results.summary}
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          marginBottom: 20,
        }}
      >
        {/* Left: Test Cases */}
        <TestCaseGrid
          testCases={results.test_cases}
          resultMap={resultMap}
          analysisMap={analysisMap}
        />

        {/* Right: Failures + Complexity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <FailureAnalysisPanel
            failureAnalyses={results.failure_analyses}
            testCases={results.test_cases}
          />
          <ComplexityPanel insight={results.complexity_insight} />
        </div>
      </div>
    </div>
  );
}