"use client";

import { useState, useEffect } from "react";

const STAGES = [
  { label: "Parsing problem statement...", icon: "📋", duration: 2000 },
  { label: "Analyzing solution logic...", icon: "🔍", duration: 3000 },
  { label: "Generating adversarial test cases...", icon: "🎯", duration: 4000 },
  { label: "Running secure sandbox execution...", icon: "⚙️", duration: 5000 },
  { label: "Detecting failures & bugs...", icon: "🐛", duration: 6000 },
  { label: "Generating AI explanations...", icon: "🧠", duration: 7000 },
  { label: "Building performance insights...", icon: "📊", duration: 8000 },
];

export default function LoadingOverlay() {
  const [currentStage, setCurrentStage] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((e) => e + 100);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const idx = STAGES.findIndex((s) => elapsed < s.duration);
    if (idx !== -1) setCurrentStage(idx);
    else setCurrentStage(STAGES.length - 1);
  }, [elapsed]);

  const progress = Math.min((elapsed / 12000) * 100, 95);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,15,0.97)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Pulsing orb */}
      <div style={{ position: "relative", marginBottom: 48 }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--accent), #3b82f6)",
            opacity: 0.15,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            animation: "pulse-glow 1.5s ease-in-out infinite",
            filter: "blur(20px)",
          }}
        />
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            border: "2px solid transparent",
            borderTopColor: "var(--accent)",
            borderRightColor: "#3b82f6",
            animation: "spin-slow 1s linear infinite",
            position: "relative",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 28,
          }}
        >
          {STAGES[currentStage]?.icon}
        </div>
      </div>

      {/* Stage label */}
      <div
        key={currentStage}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1.25rem",
          color: "var(--text)",
          marginBottom: 8,
          animation: "fade-in 0.3s ease forwards",
          textAlign: "center",
        }}
      >
        {STAGES[currentStage]?.label}
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.7rem",
          color: "var(--text-muted)",
          marginBottom: 40,
          letterSpacing: "0.05em",
        }}
      >
        GPT-4o is analyzing your code...
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: 400,
          maxWidth: "80vw",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "var(--text-dim)",
              letterSpacing: "0.1em",
            }}
          >
            PROGRESS
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6rem",
              color: "var(--accent-bright)",
            }}
          >
            {Math.round(progress)}%
          </span>
        </div>
        <div
          style={{
            width: "100%",
            height: 4,
            background: "var(--bg-elevated)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--accent), #3b82f6)",
              borderRadius: 2,
              transition: "width 0.1s linear",
              boxShadow: "0 0 10px var(--accent-glow)",
            }}
          />
        </div>
      </div>

      {/* Stages list */}
      <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 8 }}>
        {STAGES.map((stage, i) => {
          const done = i < currentStage;
          const active = i === currentStage;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: done ? 0.5 : active ? 1 : 0.2,
                transition: "opacity 0.3s",
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: `1px solid ${done ? "var(--green)" : active ? "var(--accent)" : "var(--border)"}`,
                  background: done ? "var(--green-dim)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 8,
                  flexShrink: 0,
                }}
              >
                {done && "✓"}
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.65rem",
                  color: done ? "var(--green)" : active ? "var(--text)" : "var(--text-dim)",
                  letterSpacing: "0.02em",
                }}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}