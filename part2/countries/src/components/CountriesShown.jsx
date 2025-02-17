import Country from './Country'

const CountriesShown = ({ countriesToShow, handleShowCountry, filterName }) => {
  if (filterName === '') {
    return <div>Enter a country name to search</div>
  }
  if (countriesToShow.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countriesToShow.length === 1) {
    return <Country country={countriesToShow[0]} />
  }
  return (
    <div>
      {countriesToShow.map(country => (
        <div key={country.name.common}>
          {country.name.common} <button onClick={() => handleShowCountry(country)}>show</button>
        </div>
      ))}
    </div>
  )
}

export default CountriesShown