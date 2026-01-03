import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import './App.css'

function App() {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  })

  // Handle Window Resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Timer and Celebration Logic
  useEffect(() => {
    const startDate = new Date('2026-01-01T00:00:00').getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = now - startDate

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      // Milestone Logic:
      // If days is a multiple of 100 (e.g., 100, 200, 300), showConfetti is true.
      // As soon as 'days' hits 101, this becomes false and confetti stops.
      if (days > 0 && days % 100 === 0) {
        setShowConfetti(true)
      } else {
        setShowConfetti(false)
      }

      setElapsed({ days, hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="timer-container">
      {showConfetti && (
        <Confetti 
          width={windowSize.width} 
          height={windowSize.height} 
          numberOfPieces={300} // Keeps it festive without lagging the browser
          recycle={true}       // Ensures it keeps falling all day long
        />
      )}
      
      <div className={`timer ${showConfetti ? 'milestone-active' : ''}`}>
        <div className="time-unit">
          <span className="time-value">{String(elapsed.days).padStart(2, '0')}</span>
          <span className="time-label">DAYS</span>
        </div>
        <div className="time-unit">
          <span className="time-value">{String(elapsed.hours).padStart(2, '0')}</span>
          <span className="time-label">HOURS</span>
        </div>
        <div className="time-unit">
          <span className="time-value">{String(elapsed.minutes).padStart(2, '0')}</span>
          <span className="time-label">MINUTES</span>
        </div>
        <div className="time-unit">
          <span className="time-value">{String(elapsed.seconds).padStart(2, '0')}</span>
          <span className="time-label">SECONDS</span>
        </div>
      </div>
      
    </div>
  )
}

export default App
