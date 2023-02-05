// Set global constants
const cityInput = document.querySelector('.cityInput')
const cityBtn = document.querySelector('.cityBtn')
const unitBtnF = document.querySelector('.unitBtnF')
const unitBtnC = document.querySelector('.unitBtnC')
const fc_container = document.querySelector('.cardContainer')
const windSpdUnits = document.querySelector('#spdUnit')
let city = cityInput.value || "Tampa"

console.log(city)
// API data for default city on page load (imperial default)
window.addEventListener('load', () => {
  conditionals.chooseUnits(city, 'MPH', unitBtnC, unitBtnF, 'imperial')
})

// API data for user requested city (imperial default)
cityBtn.addEventListener('click', () => {
  fc_container.textContent = ""
  conditionals.chooseUnits(city, 'MPH', unitBtnC, unitBtnF, 'imperial')
})

// Use imperial units
unitBtnF.addEventListener('click', () => {
  fc_container.textContent = ""
  conditionals.chooseUnits(city, 'MPH', unitBtnC, unitBtnF, 'imperial')
})

// Use metric units
unitBtnC.addEventListener('click', () => {
  fc_container.textContent = ""
  conditionals.chooseUnits(city, 'KPH', unitBtnF, unitBtnC, 'metric')
})

const weatherAPI = (() => {

  const API_KEY = 'bce6589961837feae71c25d01123dd30'

  // API call for 5 day forcast. 
  const forcast = (city, units) => {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${API_KEY}`)
      .then(res => res.json())
      .then(data => data.list.forEach((item) => {
        conditionals.forcastData(item)
      }))
      .catch(error => console.error(error));
  }

  // api call and response formatting
  const current = (city, units) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${API_KEY}`)
      .then(res => res.json())
      .then((data) => { conditionals.currentData(data) })
      .catch(error => console.error(error));
  }

  return {
    current,
    forcast,
  }

})()

const conditionals = (() => {
  const dataCity = document.querySelector('#city')
  const dataTemp = document.querySelector('#temp')
  const dataTempFeel = document.querySelector('#tempFeel')
  const dataWind = document.querySelector('#wind')
  const currentCond = document.querySelector('#condition')
  const weatherDesc = document.querySelector('#weatherDesc')

  const currentData = (data) => {
    // Weather group icon
    currentCond.classList.add(conditionals.weatherCondition(data.weather[0].main))
    // Weather condition description
    weatherDesc.innerText = `${data.weather[0].description}`
    // Location
    dataCity.innerText = `${data.name}, ${data.sys.country}`
    // Current temp
    dataTemp.innerText = `${Math.round(data.main.temp)}\u00B0`
    // Perceived temp
    dataTempFeel.innerText = `Feels like ${Math.round(data.main.feels_like)}\u00B0`
    // Wind speed and direction
    dataWind.innerText = `Wind: ${conditionals.windDirection(data.wind.deg)}, ${Math.round(data.wind.speed)}`
  }

  const forcastData = (item) => {

    // Forcast cards are based on 12:00(noon) for each day. 
    // Future implementation might take an average weather 
    // of the expected conditions for a 'whole day' forcast.
    if (item.dt_txt.search(/12:00:00/g) >= 0) {
      const fc_card_el = document.createElement('div');
      fc_card_el.classList.add('weatherCard');

      fc_card_el.innerHTML = `
    
    <p class="fcTime">${item.dt_txt.slice(5, 10).replace(/(-)/g, '/')}</p>
    <i class="fa-solid ${conditionals.weatherCondition(item.weather[0].main)} fa-2x"></i>
    <p class="fcTemp">${Math.round(item.main.temp)}\u00B0</p>
  
        `;
      fc_container.appendChild(fc_card_el);
    }
  }

  // Wind direction degrees to cardinal/ordinal directions
  const windDirection = (dir) => {
    const directions = [
      "N", "NNE", "NE", "ENE",
      "E", "ESE", "SE", "SSE",
      "S", "SSW", "SW", "WSW",
      "W", "WNW", "NW", "NNW"
    ];
    const degree = 22.5;
    return directions[Math.floor((dir + degree / 2) / degree) % 16];
  };

  // Weather group data to font awesome icon name
  const weatherCondition = (cond) => {
    const weatherIcons = {
      Clear: 'fa-sun',
      Clouds: 'fa-cloud-sun',
      Rain: 'fa-cloud-rain',
      Thunderstorm: 'fa-cloud-rain',
      Snow: 'fa-snowflake',
      Mist: 'fa-cloud-rain',
    }
    return weatherIcons[cond];
  }

  const chooseUnits = (city, wSpd, current, next, unit) => {
    city = cityInput.value || "Tampa"
    windSpdUnits.innerText = wSpd
    current.classList.remove('btnSelect')
    next.classList.add('btnSelect')
    weatherAPI.current(city, unit)
    weatherAPI.forcast(city, unit)
  }

  return {
    currentData,
    forcastData,
    weatherCondition,
    windDirection,
    chooseUnits,
  }

})()