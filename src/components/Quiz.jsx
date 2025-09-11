import React, { useState, useCallback, useMemo } from 'react'

// Memoize questions data to prevent recreation on every render
const questions = [
  {
    question: 'Which language is used to design web pages?',
    options: ['Python', 'HTML', 'C++', 'Java'],
    answer: 'HTML',
  },
  {
    question: 'What is the main unit of processor speed?',
    options: ['Byte', 'GHz', 'MB', 'Hz'],
    answer: 'GHz',
  },
  {
    question: 'Which one is NOT a web browser?',
    options: ['Chrome', 'Firefox', 'Edge', 'Linux'],
    answer: 'Linux',
  },
  {
    question: 'Which one is an object-oriented programming language?',
    options: ['C', 'Java', 'HTML', 'SQL'],
    answer: 'Java',
  },
  {
    question: 'What is CSS used for?',
    options: [
      'Managing databases',
      'Styling web pages',
      'Writing server-side scripts',
      'Creating mobile apps',
    ],
    answer: 'Styling web pages',
  },
  {
    question: 'What does RAM stand for?',
    options: [
      'Read Access Memory',
      'Random Access Memory',
      'Ready Active Mode',
      'Rapid Application Method',
    ],
    answer: 'Random Access Memory',
  },
  {
    question: 'Which one is NOT an operating system?',
    options: ['Windows', 'Linux', 'Android', 'Oracle'],
    answer: 'Oracle',
  },
  {
    question: 'Which one is a database?',
    options: ['MongoDB', 'HTML', 'CSS', 'React'],
    answer: 'MongoDB',
  },
  {
    question: 'Which protocol is used for file transfer over the Internet?',
    options: ['HTTP', 'FTP', 'SMTP', 'IP'],
    answer: 'FTP',
  },
  {
    question: 'Which language is used for styling web pages?',
    options: ['CSS', 'PHP', 'C#', 'SQL'],
    answer: 'CSS',
  },
]

// Memoized Result component to prevent unnecessary re-renders
const Result = React.memo(({ score, total, onRestart }) => {
  const percentage = Math.round((score / total) * 100)

  // Memoize the result message
  const message = useMemo(() => {
    if (percentage === 100) return "Perfect score! You're a tech genius! 🎉"
    if (percentage >= 80) return 'Excellent job! You know your tech! 👏'
    if (percentage >= 60) return 'Good effort! Keep learning! 👍'
    return "Keep studying! You'll get better! 💪"
  }, [percentage])

  return (
    <div style={styles.quizContainer}>
      <div style={styles.result}>
        <h2 style={styles.resultTitle}>Quiz Completed!</h2>
        <div style={styles.scoreCircle}>
          <span style={styles.scoreText}>
            {score}/{total}
          </span>
        </div>
        <p style={styles.percentage}>{percentage}%</p>
        <p style={styles.message}>{message}</p>
      </div>
      <div style={styles.restartButton}>
        <button style={styles.button} onClick={onRestart}>
          Try Again
        </button>
      </div>
    </div>
  )
})

Result.displayName = 'Result'

// Main Quiz component
export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState(
    Array(questions.length).fill(null)
  )
  const [showResults, setShowResults] = useState(false)

  // Calculate score based on user answers
  const score = useMemo(
    () =>
      userAnswers.reduce(
        (total, answer, index) =>
          answer === questions[index].answer ? total + 1 : total,
        0
      ),
    [userAnswers]
  )

  // Memoized handler for answer selection
  const handleAnswerSelect = useCallback((questionIndex, selectedOption) => {
    setUserAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[questionIndex] = selectedOption
      return newAnswers
    })
  }, [])

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }, [currentQuestion])

  const handlePrevious = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }, [currentQuestion])

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0)
    setUserAnswers(Array(questions.length).fill(null))
    setShowResults(false)
  }, [])

  // Memoize current question data
  const currentQ = useMemo(() => questions[currentQuestion], [currentQuestion])
  const progress = useMemo(
    () => ((currentQuestion + 1) / questions.length) * 100,
    [currentQuestion]
  )

  // Show results if needed
  if (showResults) {
    return (
      <Result
        score={score}
        total={questions.length}
        onRestart={handleRestart}
      />
    )
  }

  return (
    <div style={styles.quizContainer}>
      <div style={styles.progressBar}>
        <div style={{ ...styles.progress, width: `${progress}%` }}></div>
      </div>

      <div style={styles.questionCounter}>
        Question {currentQuestion + 1} of {questions.length}
      </div>

      <div style={styles.questionCard}>
        <h2 style={styles.questionText}>{currentQ.question}</h2>
        <div style={styles.options}>
          {currentQ.options.map((option, idx) => (
            <div
              key={idx}
              style={{
                ...styles.option,
                ...(userAnswers[currentQuestion] === option
                  ? styles.selectedOption
                  : {}),
              }}
              onClick={() => handleAnswerSelect(currentQuestion, option)}
            >
              <span style={styles.optionLetter}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span style={styles.optionText}>{option}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.navigation}>
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          style={{
            ...styles.navButton,
            ...(currentQuestion === 0 ? styles.disabledButton : {}),
          }}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          style={{ ...styles.navButton, ...styles.nextButton }}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </button>
      </div>
    </div>
  )
}

// Inline CSS styles
const styles = {
  quizContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#4caf50',
    transition: 'width 0.3s ease',
  },
  questionCounter: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '15px',
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    marginBottom: '20px',
  },
  questionText: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    border: '2px solid transparent', // همیشه باشه
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    outline: 'none', // این خط خیلی مهمه
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    border: '2px solid #2196f3',
  },
  optionLetter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30px',
    height: '30px',
    backgroundColor: '#2196f3',
    color: 'white',
    borderRadius: '50%',
    marginRight: '15px',
    fontWeight: 'bold',
  },
  optionText: {
    fontSize: '16px',
    color: '#333',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: '12px 24px',
    fontSize: '16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#e0e0e0',
    color: '#333',
  },
  nextButton: {
    backgroundColor: '#4caf50',
    color: 'white',
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  result: {
    textAlign: 'center',
    padding: '30px',
  },
  resultTitle: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#333',
  },
  scoreCircle: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#4caf50',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    border: '4px solid #81c784',
  },
  scoreText: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
  },
  percentage: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: '10px',
  },
  message: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '20px',
  },
  restartButton: {
    textAlign: 'center',
    marginTop: '20px',
  },
  button: {
    padding: '12px 30px',
    fontSize: '16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#2196f3',
    color: 'white',
    transition: 'background-color 0.2s ease',
  },
}
