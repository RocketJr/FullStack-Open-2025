import { useState, useEffect } from 'react'
import axios from 'axios'

const Country = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
      .get(`http://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${api_key}&units=metric`)
      .then(response => {
        setWeather(response.data)
      })
  }, [api_key, country.capital])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital[0]}</div>
      <div>Area {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
      <h2>Weather in {country.capital[0]}</h2>
      {weather ? (
        <div>
          <div>Temperature: {weather.main.temp} Celsius</div>
          <div> 
            <img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} alt={weather.weather[0].description} />
          </div>
          <div>Wind: {weather.wind.speed} m/s</div>
        </div>
      ) : (
        <div>Loading weather...</div>
      )}
    </div>
  )
}

export default Country