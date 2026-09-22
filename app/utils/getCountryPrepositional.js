import countryCases from '~/data/country-cases.json'

function getCountryPrepositional(countryName, typePrepositional = 'prepositional') {
    if (!countryName) return ''
  
    for (let i = 0; i < countryCases.length; i++) {
      if (countryCases[i].original === countryName) {
        return countryCases[i][typePrepositional] || countryName
      }
    }
  
    return countryName
}

export {getCountryPrepositional}