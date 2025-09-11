import React, { useState, useEffect, useRef, useCallback } from 'react'

const Timer = () => {
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const intervalRef = useRef(null)
  const startTimeRef = useRef(0)

  const formatTime = useCallback((timeInMs) => {
    const hours = Math.floor(timeInMs / 3600000)
    const minutes = Math.floor((timeInMs % 3600000) / 60000)
    const seconds = Math.floor((timeInMs % 60000) / 1000)
    const milliseconds = Math.floor((timeInMs % 1000) / 10)

    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0'),
      milliseconds: milliseconds.toString().padStart(2, '0'),
    }
  }, [])

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - time
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTimeRef.current)
      }, 10)
      setIsRunning(true)
    }
  }, [isRunning, time])

  const pause = useCallback(() => {
    if (isRunning) {
      clearInterval(intervalRef.current)
      setIsRunning(false)
    }
  }, [isRunning])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setTime(0)
    setIsRunning(false)
    setLaps([])
  }, [])

  const addLap = useCallback(() => {
    if (isRunning) {
      setLaps((prev) => [...prev, formatTime(time)])
    }
  }, [isRunning, time, formatTime])

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const { hours, minutes, seconds, milliseconds } = formatTime(time)

  return (
    <div>
      <div>
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>.
        <span>{milliseconds}</span>
      </div>

      <div>
        {isRunning ? (
          <>
            <button onClick={pause}>Pause</button>
            <button onClick={addLap}>Lap</button>
          </>
        ) : (
          <>
            <button onClick={start}>Start</button>
            <button onClick={reset}>Reset</button>
          </>
        )}
      </div>

      {laps.length > 0 && (
        <div>
          <h3>Laps:</h3>
          <ol>
            {laps.map((lap, index) => (
              <li key={index}>
                {lap.hours}:{lap.minutes}:{lap.seconds}.{lap.milliseconds}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export default Timer
