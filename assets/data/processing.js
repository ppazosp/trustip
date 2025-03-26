function selectCountries(list, countries) {
  return list.map(name => {
    const country = countries.find(c => c.name === name);
    const {latitude, longitude} = country;
    return {name, latitude, longitude};
  })
}


function getCountry(name, countries) {
  return countries.find(c => c.name === name);
}

function getCountries(object, countries) {
  return Object.keys(object).reduce((r, e) => {
    r[e] = object[e].map(c => getCountry(c, countries))
    return r;
  }, {})
}


