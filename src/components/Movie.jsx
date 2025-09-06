import { useEffect, useState } from 'react'

export default function MovieApp() {
  const [movieData, setMovieData] = useState('')
  const fetchMovieData = async () => {
    try {
      const res = await fetch(
        'https://www.omdbapi.com/?t=wednesday&apikey=876fd445'
      )
      const data = await res.json()
      setMovieData(data)
    } catch {
      console.log('error not fount this movie')
    }
  }
  useEffect(() => {fetchMovieData()}, [])
  return (
    <div>
        <h1>movie title : {movieData.Title}</h1>
        <img src={movieData.Poster} alt="Poster" width={"200px"} height={"200px"}  />
    </div>
  )
}
