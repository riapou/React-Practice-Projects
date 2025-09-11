import React, { useState, useEffect, useCallback, useMemo } from 'react'

const WeatherApp = () => {
  // State management
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [location, setLocation] = useState('')
  const [coords, setCoords] = useState({ lat: null, lon: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [unitSystem, setUnitSystem] = useState('metric')
  const [recentSearches, setRecentSearches] = useState([])
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('weatherFavorites')) || []
  )
  const [selectedDay, setSelectedDay] = useState(0)

  // API configuration
  const API_KEY = '8627b803159aac5305bd5ea8e185cac0'
  const BASE_URL = 'https://api.openweathermap.org/data/2.5'

  // Memoized API endpoints
  const endpoints = useMemo(
    () => ({
      current: `${BASE_URL}/weather`,
      forecast: `${BASE_URL}/forecast`,
      geo: `${BASE_URL}/weather`,
    }),
    []
  )

  // Memoized unit conversions
  const units = useMemo(
    () => ({
      metric: { temp: '°C', speed: 'm/s' },
      imperial: { temp: '°F', speed: 'mph' },
    }),
    []
  )

  // Fetch weather data
  const fetchWeatherData = useCallback(
    async (url, params = {}) => {
      try {
        const queryParams = new URLSearchParams({
          ...params,
          appid: API_KEY,
          units: unitSystem,
        }).toString()

        const response = await fetch(`${url}?${queryParams}`)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        return await response.json()
      } catch (err) {
        setError(`Failed to fetch data: ${err.message}`)
        throw err
      }
    },
    [API_KEY, unitSystem]
  )

  // Get weather by location
  const getWeatherByLocation = useCallback(
    async (loc) => {
      setLoading(true)
      setError('')

      try {
        const [current, forecast] = await Promise.all([
          fetchWeatherData(endpoints.current, { q: loc }),
          fetchWeatherData(endpoints.forecast, { q: loc }),
        ])

        setWeatherData(current)
        setForecastData(processForecastData(forecast))
        setCoords({ lat: current.coord.lat, lon: current.coord.lon })

        // Add to recent searches
        addToRecentSearches(current.name)
      } catch (err) {
        console.error('Error fetching weather data:', err)
      } finally {
        setLoading(false)
      }
    },
    [fetchWeatherData, endpoints]
  )

  // Get weather by coordinates
  const getWeatherByCoords = useCallback(
    async (latitude, longitude) => {
      setLoading(true)
      setError('')

      try {
        const [current, forecast] = await Promise.all([
          fetchWeatherData(endpoints.current, {
            lat: latitude,
            lon: longitude,
          }),
          fetchWeatherData(endpoints.forecast, {
            lat: latitude,
            lon: longitude,
          }),
        ])

        setWeatherData(current)
        setForecastData(processForecastData(forecast))
        setLocation(current.name)
        setCoords({ lat: latitude, lon: longitude })
      } catch (err) {
        console.error('Error fetching weather by coordinates:', err)
      } finally {
        setLoading(false)
      }
    },
    [fetchWeatherData, endpoints]
  )

  // Process forecast data to group by day
  const processForecastData = useCallback((data) => {
    const dailyData = {}

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000)
      const day = date.toDateString()

      if (!dailyData[day]) {
        dailyData[day] = {
          date,
          temps: [],
          humidities: [],
          conditions: [],
          windSpeeds: [],
          dataPoints: [],
        }
      }

      dailyData[day].temps.push(item.main.temp)
      dailyData[day].humidities.push(item.main.humidity)
      dailyData[day].conditions.push(item.weather[0].main)
      dailyData[day].windSpeeds.push(item.wind.speed)
      dailyData[day].dataPoints.push(item)
    })

    return Object.values(dailyData).map((day) => ({
      date: day.date,
      minTemp: Math.min(...day.temps),
      maxTemp: Math.max(...day.temps),
      avgHumidity: Math.round(
        day.humidities.reduce((a, b) => a + b, 0) / day.humidities.length
      ),
      dominantCondition: getDominantCondition(day.conditions),
      windSpeed: Math.round(
        day.windSpeeds.reduce((a, b) => a + b, 0) / day.windSpeeds.length
      ),
      hourlyData: day.dataPoints,
    }))
  }, [])

  // Helper to find dominant weather condition
  const getDominantCondition = useCallback((conditions) => {
    const frequency = {}
    let maxFreq = 0
    let dominantCond = conditions[0]

    conditions.forEach((cond) => {
      frequency[cond] = (frequency[cond] || 0) + 1
      if (frequency[cond] > maxFreq) {
        maxFreq = frequency[cond]
        dominantCond = cond
      }
    })

    return dominantCond
  }, [])

  // Add location to recent searches
  const addToRecentSearches = useCallback((locationName) => {
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== locationName)
      return [locationName, ...filtered].slice(0, 5)
    })
  }, [])

  // Toggle favorite location
  const toggleFavorite = useCallback(() => {
    if (!weatherData) return

    setFavorites((prev) => {
      const isFavorite = prev.some((fav) => fav.id === weatherData.id)

      if (isFavorite) {
        return prev.filter((fav) => fav.id !== weatherData.id)
      } else {
        return [
          ...prev,
          {
            id: weatherData.id,
            name: weatherData.name,
            country: weatherData.sys.country,
            coords: weatherData.coord,
          },
        ]
      }
    })
  }, [weatherData])

  // Check if current location is favorite
  const isFavorite = useMemo(() => {
    if (!weatherData) return false
    return favorites.some((fav) => fav.id === weatherData.id)
  }, [favorites, weatherData])

  // Get user's geolocation
  const getGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude)
      },
      (err) => {
        setError(`Geolocation error: ${err.message}`)
        setLoading(false)
      }
    )
  }, [getWeatherByCoords])

  // Handle search submission
  const handleSearch = useCallback(
    (e) => {
      e.preventDefault()
      if (location.trim()) {
        getWeatherByLocation(location.trim())
      }
    },
    [location, getWeatherByLocation]
  )

  // Load weather for a favorite location
  const loadFavorite = useCallback(
    (fav) => {
      setLocation(fav.name)
      getWeatherByCoords(fav.coords.lat, fav.coords.lon)
    },
    [getWeatherByCoords]
  )

  // Effect for initial data load
  useEffect(() => {
    // Try to load from localStorage
    // const savedFavorites = localStorage.getItem('weatherFavorites')
    // if (savedFavorites) {
    //   setFavorites(JSON.parse(savedFavorites))
    // }

    const lastLocation = localStorage.getItem('lastWeatherLocation')
    if (lastLocation) {
      setLocation(lastLocation)
      getWeatherByLocation(lastLocation)
    } else {
      // Or get geolocation if available
      getGeolocation()
    }
  }, [getWeatherByLocation, getGeolocation])

  // Effect to save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites))
  }, [favorites])

  // Effect to save last location
  useEffect(() => {
    if (weatherData) {
      localStorage.setItem('lastWeatherLocation', weatherData.name)
    }
  }, [weatherData])

  // Memoized current weather details
  const currentWeather = useMemo(() => {
    if (!weatherData) return null

    return {
      temp: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      humidity: weatherData.main.humidity,
      pressure: weatherData.main.pressure,
      windSpeed: Math.round(weatherData.wind.speed),
      windDirection: weatherData.wind.deg,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      visibility: weatherData.visibility / 1000, // Convert to km
      sunrise: new Date(weatherData.sys.sunrise * 1000),
      sunset: new Date(weatherData.sys.sunset * 1000),
    }
  }, [weatherData])

  // Memoized selected day forecast
  const selectedForecast = useMemo(() => {
    if (!forecastData || !forecastData[selectedDay]) return null
    return forecastData[selectedDay]
  }, [forecastData, selectedDay])

  return (
    <div>
      {/* Search Section */}
      <div>
        <form onSubmit={handleSearch}>
          <input
            type='text'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Enter city name'
          />
          <button type='submit'>Search</button>
        </form>
        <button onClick={getGeolocation}>Use My Location</button>
      </div>

      {/* Unit Toggle */}
      <div>
        <label>
          <input
            type='radio'
            checked={unitSystem === 'metric'}
            onChange={() => setUnitSystem('metric')}
          />
          Metric (°C, m/s)
        </label>
        <label>
          <input
            type='radio'
            checked={unitSystem === 'imperial'}
            onChange={() => setUnitSystem('imperial')}
          />
          Imperial (°F, mph)
        </label>
      </div>

      {/* Loading and Error States */}
      {loading && <div>Loading weather data...</div>}
      {error && <div>Error: {error}</div>}

      {/* Current Weather Display */}
      {currentWeather && (
        <div>
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <div>
            <div>
              Temperature: {currentWeather.temp}
              {units[unitSystem].temp}
            </div>
            <div>
              Feels like: {currentWeather.feelsLike}
              {units[unitSystem].temp}
            </div>
            <div>Condition: {currentWeather.description}</div>
            <div>Humidity: {currentWeather.humidity}%</div>
            <div>
              Wind: {currentWeather.windSpeed} {units[unitSystem].speed}
            </div>
            <div>Pressure: {currentWeather.pressure} hPa</div>
            <div>Visibility: {currentWeather.visibility} km</div>
          </div>
          <button onClick={toggleFavorite}>
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </button>
        </div>
      )}

      {/* Forecast Navigation */}
      {forecastData && (
        <div>
          <h3>5-Day Forecast</h3>
          <div>
            {forecastData.map((day, index) => (
              <button
                key={day.date.toISOString()}
                onClick={() => setSelectedDay(index)}
                className={selectedDay === index ? 'active' : ''}
              >
                {day.date.toLocaleDateString(undefined, { weekday: 'short' })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Day Forecast Details */}
      {selectedForecast && (
        <div>
          <h4>
            Detailed Forecast for {selectedForecast.date.toLocaleDateString()}
          </h4>
          <div>
            <div>
              High: {selectedForecast.maxTemp}
              {units[unitSystem].temp}
            </div>
            <div>
              Low: {selectedForecast.minTemp}
              {units[unitSystem].temp}
            </div>
            <div>Condition: {selectedForecast.dominantCondition}</div>
            <div>Average Humidity: {selectedForecast.avgHumidity}%</div>
            <div>
              Wind: {selectedForecast.windSpeed} {units[unitSystem].speed}
            </div>
          </div>

          <h5>Hourly Breakdown</h5>
          <div>
            {selectedForecast.hourlyData.map((hour) => (
              <div key={hour.dt}>
                <div>
                  {new Date(hour.dt * 1000).toLocaleTimeString([], {
                    hour: '2-digit',
                  })}
                </div>
                <div>
                  {Math.round(hour.main.temp)}
                  {units[unitSystem].temp}
                </div>
                <div>{hour.weather[0].main}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div>
          <h3>Recent Searches</h3>
          <ul>
            {recentSearches.map((search) => (
              <li key={search} onClick={() => setLocation(search)}>
                {search}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <h3>Favorite Locations</h3>
          <ul>
            {favorites.map((fav) => (
              <li key={fav.id} onClick={() => loadFavorite(fav)}>
                {fav.name}, {fav.country}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default WeatherApp
