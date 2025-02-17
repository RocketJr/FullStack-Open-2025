import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import CountriesShown from './components/CountriesShown'
import Country from './components/Country'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterName, setFilterName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = event => {
    setFilterName(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowCountry = country => {
    setSelectedCountry(country)
  }

  const countriesToShow = filterName
    ? countries.filter(country => country.name.common.toLowerCase().includes(filterName.toLowerCase()))
    : countries

  return (
    <div>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      <div>
        {selectedCountry ? (
          <Country country={selectedCountry} />
        ) : (
          <CountriesShown
            countriesToShow={countriesToShow}
            handleShowCountry={handleShowCountry} 
            filterName={filterName}  
          />
        )}
      </div>
    </div>
  )
}

export default App