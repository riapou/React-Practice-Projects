import { useEffect, useState } from 'react'

const API_KEY = '8627b803159aac5305bd5ea8e185cac0'

export default function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null)
  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=tokyo&appid=${API_KEY}&units=metric`
      )
      const data = await res.json()
      setWeatherData(data)
    } catch (error) {
      console.error('Error fetching weather:', error)
    }
  }
  useEffect(() => {
    fetchWeather()
  }, [])

  return (
    <div>
      <h1>Tokyo Weather</h1>
      {weatherData ? (
        <div>
          <p>City: {weatherData.name}</p>
          <p>Temp: {weatherData.main.temp} °C</p>
          <p>Weather: {weatherData.weather[0].description}</p>
        </div>
      ) : (
        <p>Loading weather...</p>
      )}
    </div>
  )
}
