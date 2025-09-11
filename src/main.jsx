import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import Todo from './components/Todo.jsx'
import Counter from './components/Counter.jsx'
import Weather from './components/Weather.jsx'
import Movie from './components/Movie.jsx'
import Quiz from './components/Quiz.jsx'
import Notes from './components/Notes.jsx'
import Timer from './components/Timer.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path='/todo' element={<Todo />} />
        <Route path='/counter' element={<Counter />} />
        <Route path='/weather' element={<Weather />} />
        <Route path='/quiz' element={<Quiz />} />
        <Route path='/movie' element={<Movie />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/timer' element={<Timer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
