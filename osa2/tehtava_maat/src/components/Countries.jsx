import axios from 'axios'

const Countries = ({countries, toggleCountry, weather}) => {
  const api_key = import.meta.env.VITE_SOME_KEY  
  if (countries.length > 10) {
    return (
      <div>Too many matches, specify another filter</div>
    )
  }

  if (countries.length === 0) {
    return (
      <div>No entries found</div>
    )
  }
  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>
          capital {country.capital[0]}
          <br></br>
          area {country.area}
        </p>
        <h3>languages:</h3>
        <ul>
          {Object.keys(country.languages).map((keyName, i) => (
            <li key={i}>
              {country.languages[keyName]}
            </li>
          ))}
        </ul>
        <br></br>
        <img src={country.flags.png} width='200'></img>
        <h2>Weather in {country.capital[0]}</h2>
        <p>temperature {weather.main.temp} celsius</p>
        <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} width='100'></img>
        <p>wind {weather.wind.speed} m/s</p>
      </div>
    )
  }
  return (
    <div>
      {countries.map(country =>
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => toggleCountry(country.name.common)}>show</button>
        </li>)}
    </div>
  )

}

export default Countries