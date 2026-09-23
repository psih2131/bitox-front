export function sortByLabel(items, getLabel = (item) => item) {
  return [...items].sort((a, b) =>
    String(getLabel(a)).localeCompare(String(getLabel(b)), 'ru', { sensitivity: 'base' }),
  )
}

export function syncRefSelect(selectedRef, options, getValue = (item) => item) {
  const values = options.map(getValue)

  if (!values.length) {
    selectedRef.value = ''
    return
  }

  if (!values.includes(selectedRef.value)) {
    selectedRef.value = values[0]
  }
}

export function getCountryByName(countries, name) {
  return countries.find((item) => item.name_country === name)
}

export function getCityOptions(countries, countryName) {
  const country = getCountryByName(countries, countryName)
  if (!country?.citys?.length) return []

  return sortByLabel(
    country.citys
      .map((item) => item.city_name)
      .filter(Boolean),
  )
}

const CITY_CODE_MAP = {
  Москва: 'MSK',
  'Санкт-Петербург': 'SPB',
  Питер: 'SPB',
  MSK: 'MSK',
  SPB: 'SPB',
}

export function resolveCityCode(cityName) {
  if (!cityName) return null
  if (CITY_CODE_MAP[cityName]) return CITY_CODE_MAP[cityName]
  if (/петербург|питер|spb/i.test(cityName)) return 'SPB'
  if (/москв|msk/i.test(cityName)) return 'MSK'
  return null
}
