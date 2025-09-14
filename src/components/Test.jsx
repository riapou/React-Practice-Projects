import { useState } from 'react'

export default function Test() {
  const [watched, setWatched] = useState([])

  function toggleWatched(movie) {
    setWatched((prev) =>
      prev.includes(movie.id)
        ? prev.filter((id) => id !== movie.id)
        : [...prev, movie.id]
    )
  }

  return (
    <>
      <h1>test</h1>
      <button onClick={() => toggleWatched(movie1)}>t</button>
    </>
  )
}
const movie1 = { id: 1, title: 'The Shawshank Redemption' }
