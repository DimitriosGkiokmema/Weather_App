// HTML Elements
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

// Constants
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Now', 'Dec']
const API_KEY = '1e753cd618cf45b1859223930252308'
let LOCATION = 'Toronto'
let TIMEZONE = 'America/Toronto'

// Updates Time every one second
setInterval(() => {
    if (!TIMEZONE) {
        console.error("Unknown city");
        return '00:00 AM';
    }

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",   // e.g., "Monday"
    month: "long",     // e.g., "September"
    day: "numeric",    // e.g., "15"
    timeZone: TIMEZONE // Adjust to your city
    });
    const cityTime = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // Set to false for 24-hour format
        timeZone: TIMEZONE // Replace with your desired time zone
    });

    timeEl.innerHTML = cityTime;
    dateEl.innerHTML = formattedDate
}, 1000);

// IIFE that gets the user's coordinates to display their city's weather data
(function() {
    navigator.geolocation.getCurrentPosition((success) => {
        let {latitude, longitude } = success.coords;
        let coords = latitude + ',' + longitude;

        handleNewLocation(coords)
    });

    getWeatherData();
})();

function handleNewLocation(location) {
    LOCATION = location
    getWeatherData()
}

function getWeatherData () {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&days=10&aqi=no&alerts=no`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
    });
}

function showWeatherData (data){
    let  {humidity, dewpoint_c, gust_kph, uv, temp_c} = data.current
    let {sunrise, sunset} = data.forecast.forecastday[0].astro

    timezone.innerHTML = data.location.tz_id;
    countryEl.innerHTML = data.location.country
    TIMEZONE = data.location.tz_id

    currentWeatherItemsEl.innerHTML = 
    `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Dewpoint</div>
        <div>${dewpoint_c}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${gust_kph}</div>
    </div>
    <div class="weather-item">
        <div>UV</div>
        <div>${uv}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${sunrise}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${sunset}</div>
    </div>
    <div class="weather-item">
        <div>Current Weather</div>
        <div>${temp_c}&#176; C</div>
    </div>`;

    let otherDayForcast = ''
    let day = data.forecast.forecastday
    for (let i = 0; i < 3; i++) {
        const date = new Date(day[i].date);
        const dayName = days[date.getDay()];

        if(i == 0){
            currentTempEl.innerHTML = 
            `<img src='${data.current.condition.icon}'>
            <div class="other">
                <div class="day">${dayName}</div>
                <div class="temp">${day[i].day.avgtemp_c}&#176;C</div>
            </div>`;
        } else {
            otherDayForcast += 
            `<div class="weather-forecast-item">
                <div class="day">${dayName}</div>
                <img src='${day[i].day.condition.icon}' alt="weather icon" class="w-icon">
                <div class="temp">${day[i].day.avgtemp_c}&#176;C</div>
            </div>`;
        }
    }

    weatherForecastEl.innerHTML = otherDayForcast;
}