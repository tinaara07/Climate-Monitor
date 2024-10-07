const apiKey = '7ea5ad2abf8ee70330f75502c88d9f1c'; //  weather API key
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const currentWeatherDiv = document.getElementById('current-weather');
const forecastDiv = document.getElementById('forecast');
const searchHistoryDiv = document.getElementById('search-history');
 
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
 
// Function to fetch current weather
async function fetchCurrentWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    displayCurrentWeather(data);
}
 
// Function to fetch 5-day forecast
async function fetchForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    displayForecast(data);
}
 
// Function to display current weather
function displayCurrentWeather(data) {
    if (data.cod === '404') {
        currentWeatherDiv.innerHTML = `<p>City not found!</p>`;
        return;
    }
    const { name, main, weather, wind } = data;
    currentWeatherDiv.innerHTML = `
        <h2>${name}</h2>
        <p>Date: ${new Date().toLocaleDateString()}</p>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
        <p>Temperature: ${main.temp} °C</p>
        <p>Humidity: ${main.humidity} %</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
    `;
}
 
// Function to display forecast
function displayForecast(data) {
    // forecastDiv.innerHTML = '<h3>5-Day Forecast</h3>';
    data.list.forEach((item, index) => {
        if (index % 8 === 0) { // Display only one forecast per day
            forecastDiv.innerHTML += `
                <div>
                    <p>Date: ${new Date(item.dt * 1000).toLocaleDateString()}</p>
                    <img src="http://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                    <p>Temperature: ${item.main.temp} °C</p>
                    <p>Wind Speed: ${item.wind.speed} m/s</p>
                    <p>Humidity: ${item.main.humidity} %</p>
                </div>
            `;
        }
    });
}
 
// Function to handle search
function handleSearch() {
    const city = cityInput.value;
    if (city) {
        fetchCurrentWeather(city);
        fetchForecast(city);
        updateSearchHistory(city);
        cityInput.value = ''; // Clear the search input field
    }
}
 
// Function to update search history
function updateSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
}
 
// Function to render search history
function renderSearchHistory() {
    // searchHistoryDiv.innerHTML = '<h3>Search History</h3>';
    searchHistory.forEach(city => {
        const cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.onclick = () => {
            fetchCurrentWeather(city);
            fetchForecast(city);
        };
        searchHistoryDiv.appendChild(cityButton);
    });
}
 
// Event listeners
searchButton.addEventListener('click', handleSearch);
renderSearchHistory();