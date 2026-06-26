import React, { useState, useEffect, useRef } from 'react'
import Confetti from 'react-confetti'
import './App.css'

function App() {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [windowDimensions, setWindowDimensions] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // You can change this to test the confetti (e.g. set it exactly 100 days ago)
    const startDate = new Date('2026-10-05T00:00:00').getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const absDiff = Math.abs(now - startDate)

      const days = Math.floor(absDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((absDiff % (1000 * 60)) / 1000)

      setElapsed({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const pad = (num) => String(num).padStart(2, '0');

  const units = [
    { value: pad(elapsed.days), label: 'DAYS' },
    { value: pad(elapsed.hours), label: 'HRS' },
    { value: pad(elapsed.minutes), label: 'MIN' },
    { value: pad(elapsed.seconds), label: 'SEC' },
  ]

  const isMilestone = elapsed.days > 0 && elapsed.days % 100 === 0

  return (
    <div className="app">
      {isMilestone && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          colors={['#ffffff', '#e2e8f0', '#94a3b8', '#cbd5e1']} /* Modern minimalist grayscale/silver */
          recycle={true}
          numberOfPieces={150}
          gravity={0.05}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
        />
      )}
      
      <main className="timer-container">
        {units.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="time-unit">
              <span className="number">{unit.value}</span>
              <span className="label">{unit.label}</span>
            </div>
            {index < 3 && <span className="colon">:</span>}
          </React.Fragment>
        ))}
      </main>
    </div>
  )
}

export default App
