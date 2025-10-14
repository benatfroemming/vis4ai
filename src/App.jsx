import { useState } from 'react'
import './App.css'
import Visualization from './components/Visualization'

function App() {
  return (
    <>
      {/* Simple Header */}
      <header
        style={{
          position: 'fixed',        // makes it stay at the top while scrolling
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

      {/* Add some space below header so content isn’t hidden */}
      <div style={{ marginTop: '100px', textAlign: 'center' }}>
        <Visualization />
      </div>
    </>
  )
}

export default App

