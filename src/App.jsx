import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import Confetti from 'react-confetti'
import './App.css'

function App() {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [themeLevel, setThemeLevel] = useState(0)
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight })
  const timerRefs = useRef([])

  // Track window size for confetti
  useEffect(() => {
    const handleResize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Intro Animation
  useEffect(() => {
    gsap.fromTo(".time-group", 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.2 }
    )
    
    gsap.fromTo("h1",
      { opacity: 0, letterSpacing: "10px" },
      { opacity: 1, letterSpacing: "2px", duration: 2, ease: "power3.out" }
    )
  }, [])

  // Timer Logic & Number Rolling Animations
  useEffect(() => {
    const startDate = new Date('2026-01-01T00:00:00').getTime()

    const interval = setInterval(() => {
      const now = new Date().getTime()
      const diff = now - startDate

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setElapsed(prev => {
        // Roll animation for values that change
        const animateRoll = (index) => {
          if (timerRefs.current[index]) {
            const el = timerRefs.current[index]
            gsap.fromTo(el, 
              { y: -20, opacity: 0, rotationX: -45 }, 
              { y: 0, opacity: 1, rotationX: 0, duration: 0.4, ease: "back.out(1.5)" }
            )
          }
        }

        if (prev.seconds !== seconds) animateRoll(3)
        if (prev.minutes !== minutes) animateRoll(2)
        if (prev.hours !== hours) animateRoll(1)
        if (prev.days !== days) animateRoll(0)

        // Calculate and apply Motif changes STRICTLY for exact 100-day multiples
        let currentThemeLevel = 0;
        if (days > 0 && days % 100 === 0) {
          currentThemeLevel = Math.min(Math.floor(days / 100), 3); // Max out visual theme at level 3
        }

        if (currentThemeLevel !== themeLevel) {
          setThemeLevel(currentThemeLevel);
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [themeLevel])

  const addToRefs = (el) => {
    if (el && !timerRefs.current.includes(el)) {
      timerRefs.current.push(el)
    }
  }

  return (
    <div className={`app-wrapper theme-${themeLevel}`}>
      {/* Show Confetti ONLY when themeLevel > 0 (meaning it's exactly day 100, 200, etc.) */}
      {themeLevel > 0 && (
        <Confetti 
          width={windowDimension.width} 
          height={windowDimension.height} 
          colors={themeLevel === 1 ? ['#000000', '#333333', '#666666'] : ['#ffffff', '#cccccc', '#999999']}
          recycle={true}
          numberOfPieces={200}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
        />
      )}

      <header style={{ zIndex: 10 }}>
        <h1>TIME ELAPSED</h1>
      </header>

      <main className="timer-grid" style={{ zIndex: 10 }}>
        
        <div className="time-group">
          <div className="number-wrapper">
            <span className="number" ref={addToRefs}>{String(elapsed.days).padStart(2, '0')}</span>
          </div>
          <span className="label">DAYS</span>
        </div>

        <span className="separator">:</span>

        <div className="time-group">
          <div className="number-wrapper">
            <span className="number" ref={addToRefs}>{String(elapsed.hours).padStart(2, '0')}</span>
          </div>
          <span className="label">HRS</span>
        </div>

        <span className="separator">:</span>

        <div className="time-group">
          <div className="number-wrapper">
            <span className="number" ref={addToRefs}>{String(elapsed.minutes).padStart(2, '0')}</span>
          </div>
          <span className="label">MIN</span>
        </div>

        <span className="separator">:</span>

        <div className="time-group">
          <div className="number-wrapper">
            <span className="number" ref={addToRefs}>{String(elapsed.seconds).padStart(2, '0')}</span>
          </div>
          <span className="label">SEC</span>
        </div>

      </main>

    </div>
  )
}

export default App
