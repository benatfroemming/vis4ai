import { useEffect, useMemo, useState } from "react";
import trainingData from "../assets/training_log.json";

const arrows = ["↑", "→", "↓", "←"];
const actionNames = ["Up", "Right", "Down", "Left"];

function Qlearning() {
  const [episodeIndex, setEpisodeIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [log, setLog] = useState([]);

  const gridRows = 4;
  const gridCols = 12;
  const totalStates = gridRows * gridCols;
  const cliffStates = useMemo(() => Array.from({ length: 10 }, (_, i) => 37 + i), []);
  const startState = 36;
  const goalState = 47;

  useEffect(() => setLog(trainingData || []), []);

  const episodes = useMemo(() => {
    const ids = [...new Set(log.map((x) => x.episode))];
    ids.sort((a, b) => a - b);
    return ids;
  }, [log]);

  const currentEpisode = episodes[episodeIndex] ?? episodes[0];
  const episodeSteps = useMemo(
    () => log.filter((x) => x.episode === currentEpisode),
    [log, currentEpisode]
  );

  const safeStepIndex = Math.min(stepIndex, Math.max(episodeSteps.length - 1, 0));
  const current = episodeSteps[safeStepIndex];

  if (!log.length || !current) {
    return <p style={{ marginTop: "100px" }}>Loading training data...</p>;
  }

  const qTable = current.qTable_snapshot || [];
  const flatQ = qTable.flat();
  const qMin = flatQ.length ? Math.min(...flatQ) : 0;
  const qMax = flatQ.length ? Math.max(...flatQ) : 1;
  const qRange = qMax - qMin || 1;
  const normalize = (v) => (v - qMin) / qRange;

  const bestActions = qTable.map((values) => values.indexOf(Math.max(...values)));
  const { state, action, reward, epsilon, step } = current;
  const currentQValues = qTable[state] || [0, 0, 0, 0];
  const cumulativeReward = episodeSteps
    .slice(0, safeStepIndex + 1)
    .reduce((s, x) => s + (x.reward ?? 0), 0);

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    boxShadow: "0 10px 25px rgba(15,23,42,0.10)",
    border: "1px solid rgba(148,163,184,0.35)",
  };

  return (
    <div style={{ padding: "2rem 1rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "0.4rem" }}>Episode {currentEpisode} — Step {step}</h2>
      <p style={{ margin: 0, color: "#4b5563" }}>
        State: <strong>{state}</strong> · Action: <strong>{arrows[action]}</strong> · Reward:{" "}
        <strong>{reward}</strong> · ε: <strong>{epsilon.toFixed(2)}</strong>
      </p>

      <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 260px", ...cardStyle }}>
          <h3 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1.05rem" }}>Navigation</h3>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Episode</span>
              <span style={{ fontWeight: 600 }}>{currentEpisode}</span>
            </label>
            <input
              type="range"
              min="0"
              max={Math.max(episodes.length - 1, 0)}
              value={episodeIndex}
              onChange={(e) => {
                setEpisodeIndex(Number(e.target.value));
                setStepIndex(0);
              }}
              style={{ width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Step</span>
              <span style={{ fontWeight: 600 }}>{safeStepIndex}</span>
            </label>
            <input
              type="range"
              min="0"
              max={Math.max(episodeSteps.length - 1, 0)}
              value={safeStepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>

        <div style={{ flex: "1 1 260px", ...cardStyle }}>
          <h3 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1.05rem" }}>Episode Stats</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: "0.75rem",
              fontSize: "0.9rem",
            }}
          >
            <Stat label="Steps so far" value={safeStepIndex + 1} />
            <Stat label="Cumulative reward" value={cumulativeReward.toFixed(1)} />
            <Stat label="Current ε" value={epsilon.toFixed(3)} />
            <Stat label="Chosen action" value={`${arrows[action]} (${actionNames[action]})`} />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.4fr",
          gap: "2rem",
          marginTop: "2.25rem",
          alignItems: "flex-start",
        }}
      >
        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>CliffWalking Grid (Original Colors)</h3>
          <div
            style={{
              marginTop: "1rem",
              display: "grid",
              gridTemplateColumns: `repeat(${gridCols},45px)`,
              gridTemplateRows: `repeat(${gridRows},45px)`,
              justifyContent: "center",
              border: "2px solid #333",
              backgroundColor: "#1e1e1e",
            }}
          >
            {Array.from({ length: totalStates }, (_, i) => {
              const isAgent = i === state;
              const bestAction = bestActions[i];
              const isCliff = cliffStates.includes(i);
              const isStart = i === startState;
              const isGoal = i === goalState;

              let bgColor = "#2c2c2c";
              let content = arrows[bestAction];

              if (isCliff) bgColor = "#b22222";
              if (isGoal) bgColor = "#ffd700";
              if (isStart) bgColor = "#1e90ff";
              if (isAgent) {
                bgColor = "#4CAF50";
                content = arrows[action];
              }

              return (
                <div
                  key={i}
                  style={{
                    border: "1px solid #555",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: bgColor,
                    color: "white",
                    fontSize: "1.2rem",
                    fontWeight: isAgent ? "bold" : "normal",
                  }}
                  title={`State ${i}`}
                >
                  {isStart ? "S" : isGoal ? "G" : isCliff ? "X" : content}
                </div>
              );
            })}
          </div>
          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.8rem",
              color: "#6b7280",
            }}
          >
            <LegendSwatch color="#4CAF50" label="Agent" />{" "}
            <LegendSwatch color="#1e90ff" label="Start" />{" "}
            <LegendSwatch color="#ffd700" label="Goal" />{" "}
            <LegendSwatch color="#b22222" label="Cliff" />
          </p>
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginTop: 0 }}>Q-values for State {state}</h3>
          {currentQValues.map((qVal, idx) => {
            const norm = normalize(qVal);
            const width = 10 + norm * 90;
            const isChosen = idx === action;
            return (
              <div key={idx} style={{ marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span
                    style={{
                      fontWeight: isChosen ? 700 : 500,
                      color: isChosen ? "#111827" : "#4b5563",
                    }}
                  >
                    {arrows[idx]} {actionNames[idx]}
                  </span>
                  <span
                    style={{
                      fontWeight: isChosen ? 700 : 500,
                      color: isChosen ? "#111827" : "#4b5563",
                    }}
                  >
                    {qVal.toFixed(3)}
                  </span>
                </div>
                <div style={{ width: "100%", height: "10px", borderRadius: "999px", backgroundColor: "#e5e7eb" }}>
                  <div
                    style={{
                      width: `${width}%`,
                      height: "100%",
                      borderRadius: "999px",
                      background: isChosen
                        ? "linear-gradient(90deg,#22c55e,#16a34a)"
                        : "linear-gradient(90deg,#38bdf8,#0ea5e9)",
                      transition: "width 120ms linear",
                    }}
                  />
                </div>
              </div>
            );
          })}
          <p style={{ marginTop: "0.75rem", fontSize: "0.75rem", color: "#9ca3af" }}>
            Q-value range: [{qMin.toFixed(3)}, {qMax.toFixed(3)}]
          </p>
        </div>
      </div>

      <details style={{ marginTop: "2rem" }}>
        <summary
          style={{
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#1f2937",
          }}
        >
          Show full Q-table
        </summary>
        <div style={{ marginTop: "1rem", maxHeight: "380px", overflowY: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,70px)",
              justifyContent: "flex-start",
              gap: "4px",
              fontSize: "0.75rem",
            }}
          >
            {qTable.flat().map((val, i) => {
              const normalized = Math.min(Math.max((val + 10) / 20, 0), 1);
              const hue = 240 - normalized * 240;
              return (
                <div
                  key={i}
                  style={{
                    border: "1px solid #444",
                    borderRadius: "3px",
                    padding: "0.2rem",
                    backgroundColor: `hsl(${hue},70%,60%)`,
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  {val.toFixed(1)}
                </div>
              );
            })}
          </div>
        </div>
      </details>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ color: "#6b7280", fontSize: "0.8rem" }}>{label}</div>
      <div style={{ fontWeight: 600 }}>{value}</div>
    </div>
  );
}

function LegendSwatch({ color, label }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          backgroundColor: color,
          boxShadow: "0 0 0 1px rgba(15,23,42,0.3)",
        }}
      />
      <span>{label}</span>
    </span>
  );
}

export default Qlearning;
