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
const LOCATION = 'Toronto'

// Updates Time
setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >= 12 ? 'PM': 'AM'

    timeEl.innerHTML = hoursIn12HrFormat + ':' + (minutes < 10? '0' + minutes: minutes) + ' ' + `<span id="am-pm">${ampm}</span>`
    dateEl.innerHTML = days[day - 1 % days.length] + ', ' + months[month] + ' ' + date
}, 1000);

getWeatherData()
function getWeatherData () {
    navigator.geolocation.getCurrentPosition((success) => {
        
        // Might need in a later version
        // let {latitude, longitude } = success.coords;

        fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&days=10&aqi=no&alerts=no`).then(res => res.json()).then(data => {

        console.log(data)
        showWeatherData(data);
        })

    })
}

function showWeatherData (data){
    let  {humidity, dewpoint_c, gust_kph, uv} = data.current
    let {sunrise, sunset} = data.forecast.forecastday[0].astro

    timezone.innerHTML = data.location.tz_id;
    countryEl.innerHTML = data.location.country

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