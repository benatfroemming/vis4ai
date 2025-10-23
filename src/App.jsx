import { useState } from 'react'
import './App.css'
import Qlearning from './components/Qlearning'
import Deepqlearning from './components/Deepqlearning'

function App() {
  const [algorithmType, setAlgorithmType] = useState('qlearning');

  return (
    <>
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          backgroundColor: '#282c34',
          color: 'white',
          padding: '0.5rem 1rem',
          textAlign: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          Reinforcement Learning Visualization
        </h1>
        <h4 style={{ margin: 0, fontWeight: 'normal', opacity: 0.8 }}>
          Beñat Froemming-Aldanondo, James Sargsyan
        </h4>
      </header>

      {/* Buttons */}
      <div
        style={{
          marginTop: '80px', // gives space below fixed header
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem'
        }}
      >
        <button
          onClick={() => setAlgorithmType('qlearning')}
          style={{
            width: '200px',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            backgroundColor: algorithmType === 'qlearning' ? '#00a2ffff' : 'white',
            color: algorithmType === 'qlearning' ? 'white' : '#333',
            cursor: 'pointer',
          }}
        >
          Q-Learning
        </button>
        <button
          onClick={() => setAlgorithmType('deepqlearning')}
          style={{
            width: '200px',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '8px',
            backgroundColor: algorithmType === 'deepqlearning' ? '#00a2ffff' : 'white',
            color: algorithmType === 'deepqlearning' ? 'white' : '#333',
            cursor: 'pointer',
          }}
        >
          Deep Q-Learning
        </button>
      </div>

      {/* Conditional Rendering of Components */}
      {algorithmType === 'qlearning' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Card container */}
          <div 
            style={{
              maxWidth: '800px',
              marginBottom: '0.5rem',
              marginTop: '0.5rem',
              textAlign: 'left'
            }}
          >
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
              <strong>Q-learning</strong> is a type of reinforcement learning algorithm used to teach an agent to make 
              optimal decisions by learning the quality, or "Q-value," of a given state-action pair. It's used when the
              the state representation is discrete.
            </p>
          </div>

          {/* Qlearning component */}
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <Qlearning />
          </div>
        </div>
      )}

      {algorithmType === 'deepqlearning' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {/* Card container */}
          <div 
            style={{
              maxWidth: '800px',
              marginBottom: '0.5rem',
              marginTop: '0.5rem',
              textAlign: 'left'
            }}
          >
            <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#555' }}>
              <strong>Deep Q-learning</strong> a reinforcement learning algorithm that combines Q-learning with deep neural 
              networks to help an agent learn to make optimal decisions in complex environments. Instead of using a traditional 
              table to store Q-values, DQN uses a neural network to approximate the Q-value for each state-action pair, allowing 
              it to handle high-dimensional continuous input.  
            </p>
          </div>

          {/* Qlearning component */}
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <Deepqlearning />
          </div>
        </div>
      )}

    </>
  )
}

export default App


