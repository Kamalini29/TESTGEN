"use client";
import { useState } from "react";
import { runAnalysis, type AnalysisResponse, type RunRequest, EXAMPLE_PROBLEM, EXAMPLE_CODE } from "@/lib/api";
import InputPanel from "@/components/InputPanel";
import ResultsDashboard from "@/components/ResultsDashboard";
import LoadingOverlay from "@/components/LoadingOverlay";
import Header from "@/components/Header";
type Stage = "input" | "loading" | "results";
export default function Home() {
  const [stage, setStage] = useState<Stage>("input");
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<RunRequest | null>(null);
  const handleRun = async (req: RunRequest) => {
    setError(null); setRequest(req); setStage("loading");
    try { const data = await runAnalysis(req); setResults(data); setStage("results"); }
    catch (e: any) { setError(e.message || "Something went wrong"); setStage("input"); }
  };
  const handleReset = () => { setStage("input"); setResults(null); setError(null); };
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "Syne, sans-serif" }}>
      <Header onReset={stage === "results" ? handleReset : undefined} />
      {stage === "loading" && <LoadingOverlay />}
      {stage === "input" && <InputPanel onRun={handleRun} error={error} exampleProblem={EXAMPLE_PROBLEM} exampleCode={EXAMPLE_CODE} />}
      {stage === "results" && results && <ResultsDashboard results={results} request={request!} onReset={handleReset} />}
    </div>
  );
}
