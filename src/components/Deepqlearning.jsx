import { useEffect, useState } from "react";
import fullHistoryData from "../assets/full_episode_history.json";
import pcaData from "../assets/pca_history.json";

const actionsMap = ["←", "→"];

function Deepqlearning() {
    const [episodeIndex, setEpisodeIndex] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const [episodes, setEpisodes] = useState([]);
    const [pcaSnapshots, setPcaSnapshots] = useState([]);

    useEffect(() => {
        setEpisodes(fullHistoryData || []);
        setPcaSnapshots(pcaData || []);
    }, []);

    if (!episodes.length) {
        return <p style={{ marginTop: "100px" }}>Loading training data...</p>;
    }

    const currentEpisode = episodes[episodeIndex];
    const steps = currentEpisode.steps || [];
    const currentStep = steps[stepIndex] || {};
    const pcaSnapshot = pcaSnapshots.find(
        (p) => p.episode === currentEpisode.episode
    );

    // Extract state values safely
    const state = Array.isArray(currentStep.state?.[0])
        ? currentStep.state[0]
        : currentStep.state;
    const x = state?.[0] ?? 0; // cart position
    const theta = state?.[2] ?? 0; // pole angle (radians)
    const poleAngleDeg = theta * (180 / Math.PI); // radians -> degrees

    return (
        <div style={{ padding: "1rem", textAlign: "center" }}>
        <h2>
            Episode {currentEpisode.episode} — Step {currentStep.step ?? 0}
        </h2>
        <p>
            Action: {actionsMap[currentStep.action] ?? "—"} | Reward:{" "}
            {currentStep.reward?.toFixed(2) ?? "0.00"}
        </p>

        {/* Sliders */}
        <div style={{ margin: "1rem 0" }}>
            <label>Episode: {currentEpisode.episode}</label>
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

        <div style={{ margin: "1rem 0" }}>
            <label>Step: {stepIndex}</label>
            <input
            type="range"
            min="0"
            max={steps.length - 1}
            value={stepIndex}
            onChange={(e) => setStepIndex(Number(e.target.value))}
            style={{ width: "80%" }}
            />
        </div>

        {/* CARTPOLE VISUALIZATION */}
        <div
            style={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            }}
        >
            <div
            style={{
                width: "600px",
                height: "250px",
                position: "relative",
                border: "2px solid #333",
                borderRadius: "8px",
                backgroundColor: "#f8f8f8",
                overflow: "hidden",
            }}
            >
            {/* Track line */}
            <div
                style={{
                position: "absolute",
                bottom: "20px",
                left: "0",
                width: "100%",
                height: "2px",
                backgroundColor: "#444",
                }}
            />

            {/* Cart */}
            <div
                style={{
                position: "absolute",
                bottom: "22px",
                left: `${300 + x * 120}px`, 
                width: "60px",
                height: "30px",
                backgroundColor: "#2d2d2dff",
                borderRadius: "6px",
                transform: "translateX(-50%)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                transition: "left 0.1s linear",
                }}
            />

            {/* Pole */}
            <div
                style={{
                position: "absolute",
                bottom: "52px",
                left: `${300 + x * 120}px`,
                width: "10px",
                height: "150px",
                backgroundColor: "#ffbf00ff",
                transformOrigin: "bottom center",
                transform: `translateX(-50%) rotate(${poleAngleDeg}deg)`,
                borderRadius: "3px",
                transition: "transform 0.1s linear",
                }}
            />
            </div>

            {/* -------- PCA VISUALIZATION BELOW -------- */}
            <div>
            <h3>PCA Projection (Episode {currentEpisode.episode})</h3>
            {pcaSnapshot?.pca_coords ? (
                <div style={{ position: "relative", margin: "1rem auto" }}>
                <svg
                    width="400"
                    height="400"
                    style={{
                    border: "1px solid #333",
                    borderRadius: "8px",
                    background: "#fafafa",
                    margin: "0 auto",
                    display: "block",
                    }}
                >
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75].map((f) => (
                    <g key={f}>
                        <line
                        x1={f * 380 + 10}
                        y1="10"
                        x2={f * 380 + 10}
                        y2="390"
                        stroke="#ddd"
                        strokeWidth="1"
                        />
                        <line
                        x1="10"
                        y1={f * 380 + 10}
                        x2="390"
                        y2={f * 380 + 10}
                        stroke="#ddd"
                        strokeWidth="1"
                        />
                    </g>
                    ))}

                    {/* PCA points (centered) */}
                    {(() => {
                    const meanX =
                        pcaSnapshot.pca_coords.reduce((a, c) => a + c[0], 0) /
                        pcaSnapshot.pca_coords.length;
                    const meanY =
                        pcaSnapshot.pca_coords.reduce((a, c) => a + c[1], 0) /
                        pcaSnapshot.pca_coords.length;
                    const centered = pcaSnapshot.pca_coords.map((c) => [
                        c[0] - meanX,
                        c[1] - meanY,
                    ]);
                    const xs = centered.map((c) => c[0]);
                    const ys = centered.map((c) => c[1]);
                    const maxAbs = Math.max(
                        Math.abs(Math.min(...xs)),
                        Math.abs(Math.max(...xs)),
                        Math.abs(Math.min(...ys)),
                        Math.abs(Math.max(...ys))
                    );
                    const scale = 160 / (maxAbs || 1);

                    return centered.map((coord, i) => {
                        const cx = 200 + coord[0] * scale;
                        const cy = 200 - coord[1] * scale;
                        return (
                        <circle
                            key={i}
                            cx={cx}
                            cy={cy}
                            r="4"
                            fill={
                            pcaSnapshot.labels[i] === 1 ? "#ff4500" : "#1e90ff"
                            }
                            opacity="0.8"
                        />
                        );
                    });
                    })()}

                    {/* Center axes */}
                    <line
                    x1="200"
                    y1="10"
                    x2="200"
                    y2="390"
                    stroke="#888"
                    strokeWidth="1"
                    />
                    <line
                    x1="10"
                    y1="200"
                    x2="390"
                    y2="200"
                    stroke="#888"
                    strokeWidth="1"
                    />

                    {/* Axis labels */}
                    <text x="355" y="215" fontSize="12" fill="#555">
                    PC1 →
                    </text>
                    <text
                    x="200"
                    y="25"
                    fontSize="12"
                    fill="#555"
                    textAnchor="middle"
                    transform="rotate(-90 200,25)"
                    >
                    PC2 →
                    </text>
                </svg>
                </div>
            ) : (
                <p style={{ color: "#888" }}>No PCA data available for this episode.</p>
            )}
            </div>
        </div>
        </div>
    );
}

export default Deepqlearning;







