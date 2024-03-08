import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'





const App = () => {
  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')
  const [firstCountry, setFirstCountry] = useState(null)
  const [newWeather, setNewWeather] = useState('')
  const allFiltered = countries.filter(country => country.name.common.toLowerCase().includes(newFilter.toLowerCase()))
  const api_key = import.meta.env.VITE_SOME_KEY



  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => 
        setCountries(response.data))

  }, [])
  useEffect(() => {
    if (firstCountry) {
      const helpCountry = allFiltered[0]
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${helpCountry.capitalInfo.latlng[0]}&lon=${helpCountry.capitalInfo.latlng[1]}&appid=${api_key}&units=metric`)
        .then(response =>
          setNewWeather(response.data))
      
    }
  }, [firstCountry])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
    setFirstCountry(allFiltered[0])

  }

  const handleButtonClick = (countryName) => {
    setNewFilter(countryName.toLowerCase())
    setFirstCountry(allFiltered[0])
  }





  return (
    <div>
      find countries<input
      type='text'
      value={newFilter}
      onChange={handleFilterChange}/>
      <ul>
        <Countries countries={allFiltered} toggleCountry={handleButtonClick} weather={newWeather}/>
      </ul>
    </div>
  )
  
  
}
export default App
