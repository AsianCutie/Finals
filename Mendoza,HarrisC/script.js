document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "pmZUlgDlOjCU0Tt2IgbeQMTQL3PQeic0"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const darkModeToggle = document.getElementById("darkModeToggle");

    darkModeToggle.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
    });

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                    setBodyBackground('default');
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
                setBodyBackground('default');
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                    setBodyBackground('default');
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
                setBodyBackground('default');
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherIcon = getWeatherIcon(data.WeatherIcon);
        const weatherContent = `
            <h2>Weather</h2>
            <div class="weather-current">
                <div class="weather-icon ${weatherIcon}"></div>
                <div>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            </div>
        `;
        weatherDiv.innerHTML = weatherContent;
        setBodyBackground(weatherIcon);
    }

    function getWeatherIcon(iconCode) {
        switch(iconCode) {
            case 1: // Sunny
                return 'sunny';
            case 3: // Partly Cloudy
            case 4: // Intermittent Clouds
                return 'partly-cloudy';
            case 6: // Cloudy
            case 7: // Mostly Cloudy
                return 'cloudy';
            default:
                return 'default'; // Default to cloudy if unknown
        }
    }

    function setBodyBackground(weatherIcon) {
        document.body.className = weatherIcon;
    }
});
