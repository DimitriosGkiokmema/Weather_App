// HTML Elements
const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezoneEl = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

// Constants
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const API_KEY = '1e753cd618cf45b1859223930252308';
let LOCATION = 'Toronto';
let TIMEZONE = 'America/Toronto';

// Update clock every second
setInterval(() => {
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
    dateEl.innerHTML = formattedDate;
}, 1000);

// Fetch and show weather for a location
getWeatherData();
async function getWeatherData() {
    try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${LOCATION}&days=10&aqi=no&alerts=no`);
        const data = await res.json();
        showWeatherData(data);
        return data;
    } catch (err) {
        console.error("Error fetching weather:", err);
    }
}

// Display weather data in DOM
function showWeatherData(data) {
    let { humidity, dewpoint_c, gust_kph, uv, temp_c } = data.current;
    let { sunrise, sunset } = data.forecast.forecastday[0].astro;

    TIMEZONE = data.location.tz_id;
    timezoneEl.innerHTML = TIMEZONE;
    countryEl.innerHTML = data.location.country;

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item"><div>Humidity</div><div>${humidity}%</div></div>
        <div class="weather-item"><div>Dewpoint</div><div>${dewpoint_c}</div></div>
        <div class="weather-item"><div>Wind Speed</div><div>${gust_kph}</div></div>
        <div class="weather-item"><div>UV</div><div>${uv}</div></div>
        <div class="weather-item"><div>Sunrise</div><div>${sunrise}</div></div>
        <div class="weather-item"><div>Sunset</div><div>${sunset}</div></div>
        <div class="weather-item"><div>Current Temp</div><div>${temp_c}&#176;C</div></div>
    `;

    // Forecast for next 3 days
    const dayArr = data.forecast.forecastday;
    let forecastHTML = '';
    for (let i = 0; i < 3; i++) {
        const dateObj = new Date(dayArr[i].date);
        const dayName = days[dateObj.getDay()];
        if (i === 0) {
            currentTempEl.innerHTML = `
                <img src='${data.current.condition.icon}'>
                <div class="other">
                    <div class="day">${dayName}</div>
                    <div class="temp">${dayArr[i].day.avgtemp_c}&#176;C</div>
                </div>`;
        } else {
            forecastHTML += `
                <div class="weather-forecast-item">
                    <div class="day">${dayName}</div>
                    <img src='${dayArr[i].day.condition.icon}' class="w-icon">
                    <div class="temp">${dayArr[i].day.avgtemp_c}&#176;C</div>
                </div>`;
        }
    }
    weatherForecastEl.innerHTML = forecastHTML;
}

// Post weather data to backend
async function createData(data) {
    if (!data) return;
    let { humidity, dewpoint_c, gust_kph, uv, temp_c } = data.current;
    let { sunrise, sunset } = data.forecast.forecastday[0].astro;

    const payload = {
        location: LOCATION,
        date: new Date().toString(),
        humidity,
        dewpoint_c,
        gust_kph,
        uv,
        sunrise,
        sunset,
        temp_c
    };

    try {
        const res = await fetch("http://localhost:3000/weather", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        console.log("Posted to DB:", result);
    } catch (err) {
        console.error("Error posting to DB:", err);
    }
}

// Handle new location input
async function handleNewLocation(location) {
    LOCATION = location;
    const data = await getWeatherData();
    await createData(data);
}

// Event listener for form
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("location_form");
    if (!form) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const locationInput = document.getElementById("location");
        const location = locationInput.value.trim();
        locationInput.value = '';
        handleNewLocation(location);
    });
});

// Alternative form handling - add this to main.js
function setupFormListener() {
    const form = document.getElementById("location_form");
    if (form) {
        form.addEventListener("submit", function(event) {
            console.log("Form submit intercepted"); // Add this
            event.preventDefault();
            event.stopPropagation(); // Add this to prevent any bubbling
            const locationInput = document.getElementById("location");
            const location = locationInput.value.trim();
            
            if (location) {
                locationInput.value = '';
                handleNewLocation(location);
            }
            return false; // Additional prevention
        });
    }
}

// Call this when DOM is ready
document.addEventListener("DOMContentLoaded", setupFormListener);