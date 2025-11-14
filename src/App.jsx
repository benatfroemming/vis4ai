// App.jsx
import { useState } from 'react';
import Qlearning from './components/Qlearning';
import Deepqlearning from './components/Deepqlearning';

function App() {
  const [qEpisodeIndex, setQEpisodeIndex] = useState(0);
  const [qStepIndex, setQStepIndex] = useState(0);

  const [dqEpisodeIndex, setDQEpisodeIndex] = useState(0);
  const [dqStepIndex, setDQStepIndex] = useState(0);

  const containerStyle = {
    display: 'flex',
    width: '99vw',   // full viewport width
    height: '115vh',  // full viewport height
  };

  const panelStyle = {
    width: '50%',      // exactly half
    height: '100%',    // full height
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto', // scroll inside panel if needed
    padding: '1rem',
  };

  return (
    <div style={containerStyle}>
      {/* Left Panel - Qlearning */}
      <div style={{ ...panelStyle, backgroundColor: '#e0e0e0ff', borderRight: '1px solid #ddd' }}>
        <div style={contentStyle}>
          <Qlearning
            episodeIndex={qEpisodeIndex}
            stepIndex={qStepIndex}
            setEpisodeIndex={setQEpisodeIndex}
            setStepIndex={setQStepIndex}
          />
        </div>
      </div>

      {/* Right Panel - Deep Qlearning */}
      <div style={{ ...panelStyle, backgroundColor: '#e0e0e0ff' }}>
        <div style={contentStyle}>
          <Deepqlearning
            episodeIndex={dqEpisodeIndex}
            stepIndex={dqStepIndex}
            setEpisodeIndex={setDQEpisodeIndex}
            setStepIndex={setDQStepIndex}
          />
        </div>
      </div>
    </div>
  );
}

export default App;



