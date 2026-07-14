/* ==========================================
   WEATHER DASHBOARD - JAVASCRIPT
   ========================================== */

// ==========================================
// CONFIGURATION
// ==========================================

// Free API Key from OpenWeatherMap (Sign up at: https://openweathermap.org/api)
const API_KEY = 'a6d93ef15eafcd953a04246443ab30d5'; // Free tier key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

let searchHistory = [];
let lastUpdateTime = null;

// ==========================================
// WEATHER APP CLASS
// ==========================================

class WeatherApp {
    constructor() {
        this.currentWeatherData = null;
        this.forecastData = null;
        this.hourlyData = null;
        this.init();
    }

    init() {
        this.loadSearchHistory();
        this.setupEventListeners();
        this.attemptAutoLocation();
        console.log('🌤️ Weather App initialized');
    }

    setupEventListeners() {
        document.getElementById('searchBtn').addEventListener('click', () => this.search());
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });
        document.getElementById('currentLocationBtn').addEventListener('click', () => this.useCurrentLocation());
        document.getElementById('searchInput').addEventListener('input', (e) => this.showSuggestions(e.target.value));
    }

    // ==========================================
    // SEARCH FUNCTIONALITY
    // ==========================================

    async search() {
        const input = document.getElementById('searchInput').value.trim();
        if (!input) {
            this.showError('Please enter a city name or coordinates');
            return;
        }

        this.showLoading();
        try {
            // Try to parse as coordinates (lat,lon)
            const coordMatch = input.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
            
            let lat, lon;
            if (coordMatch) {
                lat = parseFloat(coordMatch[1]);
                lon = parseFloat(coordMatch[2]);
            } else {
                // Search by city name
                const geoData = await this.getCoordinatesByCity(input);
                if (!geoData) {
                    this.hideLoading();
                    return;
                }
                lat = geoData.lat;
                lon = geoData.lon;
                this.addToSearchHistory(geoData.name, geoData.country);
            }

            await this.fetchWeatherByCoordinates(lat, lon);
            this.hideLoading();
        } catch (error) {
            this.hideLoading();
            this.showError('Error fetching weather data. Please try again.');
            console.error('Search error:', error);
        }
    }

    async getCoordinatesByCity(cityName) {
        try {
            const response = await fetch(
                `${GEO_URL}/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`
            );
            const data = await response.json();

            if (!data || data.length === 0) {
                this.showError(`City "${cityName}" not found. Please try another city.`);
                return null;
            }

            return {
                lat: data[0].lat,
                lon: data[0].lon,
                name: data[0].name,
                country: data[0].country
            };
        } catch (error) {
            this.showError('Error fetching location data');
            console.error('Geocoding error:', error);
            return null;
        }
    }

    async fetchWeatherByCoordinates(lat, lon) {
        try {
            const currentResponse = await fetch(
                `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const forecastResponse = await fetch(
                `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );

            if (!currentResponse.ok || !forecastResponse.ok) {
                throw new Error('API Error');
            }

            this.currentWeatherData = await currentResponse.json();
            this.forecastData = await forecastResponse.json();
            
            lastUpdateTime = new Date();
            this.updateLastUpdatedTime();
            this.displayCurrentWeather();
            this.displayForecast();
            this.displayHourlyForecast();
            this.hideError();
        } catch (error) {
            this.showError('Error fetching weather data');
            console.error('Weather fetch error:', error);
        }
    }

    // ==========================================
    // LOCATION SERVICES
    // ==========================================

    useCurrentLocation() {
        this.showLoading();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.fetchWeatherByCoordinates(latitude, longitude);
                },
                (error) => {
                    this.hideLoading();
                    this.showError('Unable to get your location. Please enable location services.');
                    console.error('Geolocation error:', error);
                }
            );
        } else {
            this.hideLoading();
            this.showError('Geolocation not supported by your browser');
        }
    }

    attemptAutoLocation() {
        const lastCity = localStorage.getItem('lastWeatherCity');
        if (lastCity) {
            document.getElementById('searchInput').value = lastCity;
            this.search();
        } else {
            // Try to get user's location on first load
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        this.fetchWeatherByCoordinates(latitude, longitude);
                    },
                    () => console.log('Geolocation not granted')
                );
            }
        }
    }

    // ==========================================
    // DISPLAY CURRENT WEATHER
    // ==========================================

    displayCurrentWeather() {
        const data = this.currentWeatherData;
        const weather = data.weather[0];

        // Update location info
        const cityName = `${data.name}, ${data.sys.country}`;
        document.getElementById('locationName').textContent = cityName;
        document.getElementById('currentDate').textContent = this.formatDate(new Date());

        // Update temperature
        document.getElementById('temp').textContent = Math.round(data.main.temp);
        document.getElementById('description').textContent = weather.main;
        document.getElementById('feelsLike').textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;

        // Update weather icon
        const iconCode = weather.icon;
        document.getElementById('weatherIcon').src = 
            `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        document.getElementById('weatherIcon').alt = weather.description;

        // Update details
        document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s`;
        document.getElementById('humidity').textContent = `${data.main.humidity}%`;
        document.getElementById('pressure').textContent = `${data.main.pressure} hPa`;
        document.getElementById('visibility').textContent = `${(data.visibility / 1000).toFixed(1)} km`;

        // Update additional info
        document.getElementById('sunrise').textContent = this.formatTime(data.sys.sunrise);
        document.getElementById('sunset').textContent = this.formatTime(data.sys.sunset);
        document.getElementById('maxMin').textContent = 
            `${Math.round(data.main.temp_max)}° / ${Math.round(data.main.temp_min)}°`;

        // Save last searched city
        localStorage.setItem('lastWeatherCity', data.name);

        // Show current weather section
        document.getElementById('currentWeather').classList.remove('hidden');
    }

    // ==========================================
    // DISPLAY FORECAST
    // ==========================================

    displayForecast() {
        const forecasts = this.forecastData.list;
        const dailyForecasts = {};

        // Group forecasts by day
        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            if (!dailyForecasts[day]) {
                dailyForecasts[day] = forecast;
            }
        });

        // Display first 5 days
        const forecastContainer = document.getElementById('forecastContainer');
        forecastContainer.innerHTML = '';

        Object.entries(dailyForecasts).slice(1, 6).forEach(([day, forecast]) => {
            const card = document.createElement('div');
            card.className = 'forecast-card';

            const weather = forecast.weather[0];
            const iconCode = weather.icon;

            card.innerHTML = `
                <div class="forecast-day">${day}</div>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" 
                     class="forecast-icon" alt="${weather.description}">
                <div class="forecast-temp">${Math.round(forecast.main.temp)}°C</div>
                <div class="forecast-temp-range">
                    H: ${Math.round(forecast.main.temp_max)}° L: ${Math.round(forecast.main.temp_min)}°
                </div>
                <div class="forecast-description">${weather.main}</div>
            `;

            forecastContainer.appendChild(card);
        });

        document.getElementById('forecastSection').classList.remove('hidden');
    }

    // ==========================================
    // DISPLAY HOURLY FORECAST
    // ==========================================

    displayHourlyForecast() {
        const forecasts = this.forecastData.list.slice(0, 8); // Next 24 hours (8 x 3-hour intervals)
        const hourlyContainer = document.getElementById('hourlyContainer');
        hourlyContainer.innerHTML = '';

        forecasts.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const hour = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            const weather = forecast.weather[0];
            const iconCode = weather.icon;

            const card = document.createElement('div');
            card.className = 'hourly-card';
            card.innerHTML = `
                <div class="hourly-time">${hour}</div>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" 
                     class="hourly-icon" alt="${weather.description}">
                <div class="hourly-temp">${Math.round(forecast.main.temp)}°C</div>
                <div class="hourly-detail">💧 ${forecast.main.humidity}%</div>
                <div class="hourly-description">${weather.main}</div>
            `;

            hourlyContainer.appendChild(card);
        });

        document.getElementById('hourlySection').classList.remove('hidden');
    }

    // ==========================================
    // SEARCH SUGGESTIONS
    // ==========================================

    async showSuggestions(query) {
        if (!query || query.length < 2) {
            document.getElementById('suggestions').classList.remove('show');
            return;
        }

        try {
            const response = await fetch(
                `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
            );
            const data = await response.json();

            const suggestionsContainer = document.getElementById('suggestions');
            suggestionsContainer.innerHTML = '';

            if (data.length === 0) {
                suggestionsContainer.classList.remove('show');
                return;
            }

            data.forEach(location => {
                const item = document.createElement('div');
                item.className = 'suggestion-item';
                item.textContent = `${location.name}, ${location.country}`;
                item.addEventListener('click', () => {
                    document.getElementById('searchInput').value = location.name;
                    this.fetchWeatherByCoordinates(location.lat, location.lon);
                    suggestionsContainer.classList.remove('show');
                });
                suggestionsContainer.appendChild(item);
            });

            suggestionsContainer.classList.add('show');
        } catch (error) {
            console.error('Suggestion error:', error);
        }
    }

    // ==========================================
    // SEARCH HISTORY
    // ==========================================

    loadSearchHistory() {
        const saved = localStorage.getItem('weatherHistory');
        searchHistory = saved ? JSON.parse(saved) : [];
        this.displaySearchHistory();
    }

    addToSearchHistory(city, country) {
        const historyItem = `${city}, ${country}`;
        searchHistory = searchHistory.filter(item => item !== historyItem);
        searchHistory.unshift(historyItem);
        searchHistory = searchHistory.slice(0, 10);
        localStorage.setItem('weatherHistory', JSON.stringify(searchHistory));
        this.displaySearchHistory();
    }

    displaySearchHistory() {
        const historyContainer = document.getElementById('searchHistory');
        historyContainer.innerHTML = '';

        if (searchHistory.length === 0) {
            historyContainer.innerHTML = '<p class="history-empty">No search history yet</p>';
            return;
        }

        searchHistory.forEach(item => {
            const historyItem = document.createElement('button');
            historyItem.className = 'history-item';
            historyItem.textContent = item;
            historyItem.addEventListener('click', () => {
                document.getElementById('searchInput').value = item;
                this.search();
            });
            historyContainer.appendChild(historyItem);
        });
    }

    // ==========================================
    // UI UTILITIES
    // ==========================================

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('currentWeather').classList.add('hidden');
        document.getElementById('forecastSection').classList.add('hidden');
        document.getElementById('hourlySection').classList.add('hidden');
    }

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    }

    showError(message) {
        const errorEl = document.getElementById('error');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
        document.getElementById('currentWeather').classList.add('hidden');
        document.getElementById('forecastSection').classList.add('hidden');
        document.getElementById('hourlySection').classList.add('hidden');
    }

    hideError() {
        document.getElementById('error').classList.add('hidden');
    }

    updateLastUpdatedTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        });
        document.getElementById('lastUpdated').textContent = timeString;
    }

    // ==========================================
    // FORMATTING UTILITIES
    // ==========================================

    formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatTime(timestamp) {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        });
    }
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    window.weatherApp = new WeatherApp();
});

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + L to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});

// ==========================================
// AUTO-REFRESH
// ==========================================

// Refresh weather data every 10 minutes
setInterval(() => {
    if (window.weatherApp && window.weatherApp.currentWeatherData) {
        const { lat, lon } = window.weatherApp.currentWeatherData.coord;
        window.weatherApp.fetchWeatherByCoordinates(lat, lon);
    }
}, 600000);

// ==========================================
// CONSOLE MESSAGE
// ==========================================

console.log('%c🌤️ Weather Dashboard Loaded!', 'font-size: 18px; font-weight: bold; color: #667eea;');
console.log('%cPowered by OpenWeatherMap API', 'font-size: 12px; color: #764ba2;');
console.log('%cKeyboard Shortcuts:', 'font-size: 12px; font-weight: bold; color: #666;');
console.log('%cCtrl/Cmd + L - Focus search input', 'font-size: 11px; color: #888;');
console.log('%c✨ Auto-refreshes every 10 minutes', 'font-size: 11px; color: #48bb78; font-style: italic;');
