import { useEffect, useState } from 'react'

export default function MovieApp() {
  const [trends, setTrends] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState({
    persons: [],
    movies: [],
    tv: [],
  })
  const [details, setDetailes] = useState({})
  const [watchList, setWatchList] = useState([])
  const [watched, setWatched] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_KEY = '1bdc269df7a3947a1f173573e132064e'
  const URL_BASE = 'https://api.themoviedb.org/3'
  const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

  const endpoints = {
    trends: `${URL_BASE}/trending/all/week`,
    search: `${URL_BASE}/search/multi`,
    discoverMovie: `${URL_BASE}/discover/movie`,
    discovertv: `${URL_BASE}/discover/tv`,
    movieDetails: `${URL_BASE}/movie/`,
    tvDetails: `${URL_BASE}/tv/`,
    personDetails: `${URL_BASE}/person/`,
  }

  function AddToWatchListButton({ onClick }) {
    return <button onClick={onClick}>Add to Watchlist</button>
  }
  function MarkAsWatchedButton({ onClick }) {
    return <button onClick={onClick}>Mark as Watched</button>
  }
  function MovieCard({ movie }) {
    return (
      <div
        onClick={() => {
          fetchDetailes(movie.id, movie.media_type || movie.type)
        }}
        className='container'
        style={{
          width: '200px',
          height: '410px',
          margin: '10px',
          border: '1px solid #ccc',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <img src={movie.poster} alt={`${movie.title} poster`} />
        <div
          className='movie-info'
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3>
            {movie.title.length > 21
              ? movie.title.slice(0, 21) + '...'
              : movie.title}
          </h3>
          <span>{Math.round(movie.vote * 10) / 10}</span>
        </div>
        <div
          className='buttons'
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <AddToWatchListButton onClick={() => toggleWatchList(movie.id)} />
          <MarkAsWatchedButton onClick={() => toggleWatched(movie.id)} />
        </div>
      </div>
    )
  }
  function PersonCard({ person }) {
    return (
      <div
        onClick={() => {
          fetchDetailes(person.id, 'person')
        }}
        className='container'
        style={{
          width: '200px',
          height: '410px',
          margin: '10px',
          border: '1px solid #ccc',
          padding: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img
          style={{ borderRadius: '100%' }}
          src={person.profile || person.profile_path}
          alt={`${person.name} profile`}
        />
        <h3>{person.name}</h3>
      </div>
    )
  }
  const DetailsContent = ({ details }) => {
    const detailTypes = {
      person: <PersonDetails details={details} />,
      movie: <MovieDetails details={details} />,
      tv: <TVDetails details={details} />,
      default: <p>No details available</p>,
    }

    return detailTypes[details.type] || detailTypes.default
  }
  const PersonDetails = ({ details }) => (
    <div className='person-details'>
      <h3>{details.name}</h3>
      <img
        src={
          details.profile ||
          'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
        }
        alt={`${details.name} profile`}
        className='profile-image'
      />
      <p className='biography'>{details.biography}</p>
      <p className='birthdate'>
        <strong>Birthday:</strong> {details.birthday || 'N/A'}
      </p>
      <p className='place-of-birth'>
        <strong>Place of Birth:</strong> {details.placeOfBirth || 'N/A'}
      </p>
      <p className='known-for'>
        <strong>Known For:</strong> {details.knownFor || 'N/A'}
      </p>
      <div className='credits'>
        <h4>Top Credits:</h4>
        {details.credits.map((credit) => (
          <MovieCard key={credit.id} movie={credit} />
        ))}
      </div>
    </div>
  )
  const MovieDetails = ({ details, toggleWatchList, toggleWatched }) => (
  <div className="movie-details">
    <h3>{details.title}</h3>
    <img
      src={details.poster}
      alt={`${details.title} poster`}
      className="poster-image"
    />
    <p className="overview">{details.overview}</p>
    <p className="genres">
      <strong>Genres:</strong> {details.genres || "N/A"}
    </p>
    <p className="language">
      <strong>Original Language:</strong> {details.language || "N/A"}
    </p>
    <p className="release-date">
      <strong>Release Date:</strong> {details.releaseDate || "N/A"}
    </p>
    <p className="runtime">
      <strong>Runtime:</strong>{" "}
      {details.runtime ? `${details.runtime} min` : "N/A"}
    </p>
    <p className="status">
      <strong>Status:</strong> {details.status || "N/A"}
    </p>
    <p className="countries">
      <strong>Production Countries:</strong> {details.countries || "N/A"}
    </p>

    <div className="credits">
      <h4>Top Cast:</h4>
      {details.credits.map((credit) => (
        <PersonCard key={credit.id} person={credit} />
      ))}
    </div>

    <AddToWatchListButton onClick={() => toggleWatchList(details.id)} />
    <MarkAsWatchedButton onClick={() => toggleWatched(details.id)} />
  </div>
)

  const TVDetails = ({ details }) => (
    <div className='tv-details'>
      <h3>Series Details</h3>
      {/* Add TV-specific details here */}
    </div>
  )

  function toggleWatched(movieID) {
    setWatched((prev) =>
      prev.includes(movieID)
        ? prev.filter((id) => id !== movieID)
        : [...prev, movieID]
    )
  }
  function toggleWatchList(movieID) {
    setWatchList((prev) =>
      prev.includes(movieID)
        ? prev.filter((id) => id !== movieID)
        : [...prev, movieID]
    )
  }
  async function fetching(url, params = {}) {
    try {
      const queryParams = new URLSearchParams({
        ...params,
        api_key: API_KEY,
      }).toString()

      const response = await fetch(`${url}?${queryParams}`)

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      return response.json()
    } catch (error) {
      setError(error.message)
      throw error
    }
  }
  async function fetchTrends() {
    setLoading(true)
    setError('')

    try {
      const { results } = await fetching(endpoints.trends)

      const trends = results
        .filter((item) => item.media_type !== 'person')
        .slice(0, 5) //could be increase
        .map((item) => ({
          id: item.id,
          title: item.title || item.name,
          vote: item.vote_average,
          poster: item.poster_path
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
          media_type: item.media_type,
        }))

      setTrends(trends)
    } catch (error) {
      console.log('Error fetching trends:', error)
    } finally {
      setLoading(false)
    }
  }
  async function fetchSearchResults() {
    setLoading(true)
    setError('')

    try {
      const { results } = await fetching(endpoints.search, {
        query: searchQuery,
      })

      const persons = results
        .filter((item) => item.media_type === 'person')
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          name: item.name,
          profile: item.profile_path
            ? `${IMAGE_BASE_URL}${item.profile_path}`
            : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
          media_type: item.media_type,
        }))
      const movies = results
        .filter(
          (item) => item.media_type === 'movie' && item.vote_average !== 0
        )
        .slice(0, 5) //up
        .map((item) => ({
          id: item.id,
          title: item.title || item.name,
          vote: item.vote_average,
          poster: item.poster_path
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
          media_type: item.media_type,
        }))
      const tv = results
        .filter((item) => item.media_type === 'tv' && item.vote_average !== 0)
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          title: item.title || item.name,
          vote: item.vote_average,
          poster: item.poster_path
            ? `${IMAGE_BASE_URL}${item.poster_path}`
            : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
          media_type: item.media_type,
        }))

      const allResults = { persons, movies, tv }
      setSearchResults(allResults)
    } catch (error) {
      console.log('Error fetching trends:', error)
    } finally {
      setLoading(false)
    }
  }
  async function fetchDetailes(id, media_type) {
    try {
      switch (media_type) {
        case 'movie': {
          const movieDetails = await fetchMovieDetailes(id)
          setDetailes(movieDetails)
          break
        }
        case 'tv': {
          const tvDetails = await fetchTvDetailes(id)
          setDetailes(tvDetails)
          break
        }
        case 'person': {
          const personDetails = await fetchPersonDetailes(id)
          setDetailes(personDetails)
          break
        }
        default:
          throw new Error('Invalid media type')
      }
    } catch (error) {
      console.log('Error fetching trends:', error)
    }
  }
  async function fetchMovieDetailes(id) {
    const result = await fetching(`${endpoints.movieDetails}${id}`)
    const { cast } = await fetching(`${endpoints.movieDetails}${id}/credits`)

    return {
      id: result.id,
      title: result.title || result.name,
      genres: result.genres.map((g) => g.name).join(' , '),
      language: result.original_language,
      overview: result.overview,
      poster: result.poster_path
        ? `${IMAGE_BASE_URL}${result.poster_path}`
        : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
      vote: result.vote_average,
      releaseDate: result.release_date,
      runtime: result.runtime,
      status: result.status,
      countries: result.origin_country.join(' , '),
      credits: cast.slice(0, 10),
      type: 'movie',
    }
  }
  async function fetchTvDetailes(id) {
    const result = await fetching(`${endpoints.tvDetails}${id}`)
    const { cast } = await fetching(`${endpoints.movieDetails}${id}/credits`)

    return {
      id: result.id,
      title: result.name || result.title,
      genres: result.genres.map((g) => g.name).join(' , '),
      seasonsNumber: result.number_of_seasons,
      language: result.original_language,
      overview: result.overview,
      poster: result.poster_path
        ? `${IMAGE_BASE_URL}${result.poster_path}`
        : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg',
      vote: result.vote_average,
      releaseDate: result.first_air_date,
      status: result.status,
      countries: result.origin_country.join(' , '),
      credits: cast.slice(0, 10),
      type: 'tv',
    }
  }
  async function fetchPersonDetailes(id) {
    const result = await fetching(`${endpoints.personDetails}${id}`)
    const r1 = await fetching(`${endpoints.personDetails}${id}/movie_credits`)
    const r2 = await fetching(`${endpoints.personDetails}${id}/tv_credits`)

    const r3 = [...r1.cast, ...r2.cast]
    const credits = r3.sort((a, b) => b.popularity - a.popularity).slice(0, 10)

    return {
      id: result.id,
      name: result.name,
      biography: result.biography,
      birthday: result.birthday,
      deathday: result.deathday,
      gender: result.gender,
      knownFor: result.known_for_department,
      placeOfBirth: result.place_of_birth,
      profile: result.profile_path
        ? `${IMAGE_BASE_URL}${result.profile_path}`
        : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
      type: 'person',
      credits: credits,
    }
  }

  useEffect(() => {
    fetchTrends()
  }, [])

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <div>
          {/* Trends Section */}
          <div style={{ display: 'flex' }}>
            {trends.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {/* Search Section */}
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                fetchSearchResults()
                setSearchQuery('')
              }}
            >
              <input
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                type='text'
                placeholder='Search for a movie, tv show, person......'
                value={searchQuery}
                name='search'
              />
              <button type='submit'>Search</button>
            </form>
          </div>
          {/* Results Section */}
          <div>
            {searchResults.movies.length > 0 && (
              <div>
                <h2>Movies</h2>
                <div style={{ display: 'flex' }}>
                  {searchResults.movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
            {searchResults.tv.length > 0 && (
              <div>
                <h2>Series</h2>
                <div style={{ display: 'flex' }}>
                  {searchResults.tv.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </div>
            )}
            {searchResults.persons.length > 0 && (
              <div>
                <h2>Persons</h2>
                <div style={{ display: 'flex' }}>
                  {searchResults.persons.map((person) => (
                    <PersonCard key={person.id} person={person} />
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Detailes Section  */}
          <div>
            {details.id && (
              <div className='details-container'>
                <h2>Details</h2>
                <DetailsContent
                  details={details}
                  toggleWatchList={() => {}}
                  toggleWatched={() => {}}
                  onClick={fetchDetailes}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
