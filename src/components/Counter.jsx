import { useState, useCallback } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  // Button styles as a constant to avoid recreation on each render
  const buttonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    margin: '5px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '80px',
  }

  // Handler functions with useCallback to prevent unnecessary re-renders
  const decrement = useCallback(() => {
    setCount((c) => (c > 0 ? c - 1 : 0))
  }, [])

  const increment = useCallback(() => {
    setCount((c) => c + 1)
  }, [])

  const reset = useCallback(() => {
    setCount(0)
  }, [])

  // Keyboard support
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        decrement()
      } else if (e.key === 'ArrowUp') {
        increment()
      } else if (e.key === 'Escape') {
        reset()
      }
    },
    [decrement, increment, reset]
  )

  return (
    <div
      style={{
        textAlign: 'center',
        background: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        margin: '50px auto',
        fontFamily: 'system-ui, sans-serif',
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Counter App</h1>
      <div
        style={{
          fontSize: '3rem',
          margin: '20px 0',
          fontWeight: 'bold',
          color: count === 0 ? '#888' : '#333',
        }}
        aria-live='polite'
        aria-atomic='true'
      >
        {count}
      </div>
      <div
        style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <button
          onClick={decrement}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
            e.currentTarget.style.opacity = '0.8'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.opacity = '1'
          }}
          style={{
            ...buttonStyle,
            background: '#f44336',
            color: 'white',
          }}
          aria-label='Decrement counter'
        >
          -
        </button>
        <button
          onClick={increment}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
            e.currentTarget.style.opacity = '0.8'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.opacity = '1'
          }}
          style={{
            ...buttonStyle,
            background: '#4CAF50',
            color: 'white',
          }}
          aria-label='Increment counter'
        >
          +
        </button>
        <button
          onClick={reset}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)'
            e.currentTarget.style.opacity = '0.8'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.opacity = '1'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.opacity = '1'
          }}
          style={{
            ...buttonStyle,
            background: '#555',
            color: 'white',
          }}
          aria-label='Reset counter'
        >
          Reset
        </button>
      </div>
      <p style={{ marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
        Tip: Use arrow keys (↑/↓) to change value, Esc to reset
      </p>
    </div>
  )
}
