import { useEffect, useState } from "react";
import trainingData from "../assets/training_log.json";

// Arrow mapping for actions (0=Up, 1=Right, 2=Down, 3=Left)
const arrows = ["↑", "→", "↓", "←"];

function Qlearning() {
    const [episodeIndex, setEpisodeIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [log, setLog] = useState([]);
    const [qTable, setQTable] = useState([]);

    const gridRows = 4;
    const gridCols = 12;

    useEffect(() => {
        setLog(trainingData);
        if (trainingData.length > 0) {
        setQTable(trainingData[0].qTable_snapshot);
        }
    }, []);

    // Collect episode info
    const episodes = [...new Set(log.map((x) => x.episode))];
    const currentEpisode = episodes[episodeIndex] ?? 0;
    const episodeSteps = log.filter((x) => x.episode === currentEpisode);
    const current = episodeSteps[stepIndex];

    useEffect(() => {
        if (episodeSteps.length > 0) {
        setQTable(episodeSteps[stepIndex].qTable_snapshot);
        }
    }, [episodeIndex, stepIndex, log]);

    if (log.length === 0 || !current)
        return <p style={{ marginTop: "100px" }}>Loading training data...</p>;

    const { state, action, reward, epsilon, step } = current;
    const bestActions = qTable.map((values) =>
        values.indexOf(Math.max(...values))
    );

    // Define CliffWalking environment layout
    const totalStates = gridRows * gridCols;
    const cliffStates = Array.from({ length: 10 }, (_, i) => 37 + i); // bottom row, between start & goal
    const startState = 36;
    const goalState = 47;

    return (
        <div style={{ padding: "25px", textAlign: "center" }}>
        <h2>
            Episode {currentEpisode} — Step {step}
        </h2>
        <p>
            State: {state} | Action: {arrows[action]} | Reward: {reward} | ε:{" "}
            {epsilon.toFixed(2)}
        </p>

        {/* Episode slider */}
        <div style={{ margin: "0.5rem 0" }}>
            <label>Episode: {currentEpisode}</label>
            <input
            type="range"
            min="0"
            max={episodes.length - 1}
            value={episodeIndex}
            onChange={(e) => {
                setEpisodeIndex(Number(e.target.value));
                setStepIndex(0);
            }}
            style={{ width: "80%" }}
            />
        </div>

        {/* Step slider */}
        <div style={{ margin: "1rem 0" }}>
            <label>Step: {stepIndex}</label>
            <input
            type="range"
            min="0"
            max={episodeSteps.length - 1}
            value={stepIndex}
            onChange={(e) => setStepIndex(Number(e.target.value))}
            style={{ width: "80%" }}
            />
        </div>

        <div
            style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "3rem",
            marginTop: "2rem",
            }}
        >
            {/* --- Q-TABLE --- */}
            <div style={{ width: "300px" }}>
            <h3>Q-Table (48 states × 4 actions)</h3>
            <div
                style={{
                display: "grid",
                gridTemplateColumns: `repeat(4, 60px)`,
                justifyContent: "center",
                gap: "2px",
                fontSize: "0.75rem",
                }}
            >
                {qTable.flat().map((val, i) => {
                const normalized = Math.min(Math.max((val + 10) / 20, 0), 1);
                const hue = 240 - normalized * 240; // blue→white gradient
                return (
                    <div
                    key={i}
                    style={{
                        border: "1px solid #444",
                        borderRadius: "3px",
                        padding: "0.2rem",
                        backgroundColor: `hsl(${hue}, 70%, 60%)`,
                        color: "#fff",
                    }}
                    >
                    {val.toFixed(1)}
                    </div>
                );
                })}
            </div>
            <p style={{ marginTop: "0.5rem" }}>↑ 0 | → 1 | ↓ 2 | ← 3</p>
            </div>

            {/* --- GRID WORLD --- */}
            <div>
            <h3>CliffWalking Grid</h3>
            <div
                style={{
                display: "grid",
                gridTemplateColumns: `repeat(${gridCols}, 45px)`,
                gridTemplateRows: `repeat(${gridRows}, 45px)`,
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
                    >
                    {isStart
                        ? "S"
                        : isGoal
                        ? "G"
                        : isCliff
                        ? "X"
                        : content}
                    </div>
                );
                })}
            </div>
            </div>
        </div>
        </div>
    );
}

export default Qlearning;
