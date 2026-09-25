const apiKey = "8f7a982466ee202e963834d9a391584c";

const cityInput = document.getElementById("cityInput");

cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        getWeather();
    }
});

async function getWeather() {

    const city = cityInput.value.trim();

    const weatherCard = document.getElementById("weatherCard");
    const loading = document.getElementById("loading");

    if (city === "") {
        weatherCard.innerHTML =
            "<p>Please enter a city name.</p>";
        return;
    }

    loading.innerHTML =
        "<h3>Fetching Weather...</h3>";

    weatherCard.innerHTML = "";

    const url =
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        displayWeather(data);

        saveSearch(city);

    } catch (error) {

        weatherCard.innerHTML = `
            <p style="color:red;">
                ${error.message}
            </p>
        `;

    } finally {

        loading.innerHTML = "";

    }
}

function displayWeather(data) {

    const weatherCard =
        document.getElementById("weatherCard");

    const icon =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const today =
        new Date().toLocaleString();

    weatherCard.innerHTML = `

        <div class="weather-card">

            <h2>
                ${data.name},
                ${data.sys.country}
            </h2>

            <p> ${today}</p>

            <img src="${icon}" alt="Weather Icon">

            <h3>
                ${data.weather[0].description.toUpperCase()}
            </h3>

            <p>
                 Temperature:
                ${data.main.temp} °C
            </p>

            <p>
                 Feels Like:
                ${data.main.feels_like} °C
            </p>

            <p>
                 Humidity:
                ${data.main.humidity}%
            </p>

            <p>
                 Wind Speed:
                ${data.wind.speed} m/s
            </p>

            <p>
                 Pressure:
                ${data.main.pressure} hPa
            </p>

            <p>
                 Visibility:
                ${data.visibility / 1000} km
            </p>

            <p>
                 Sunrise:
                ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
            </p>

            <p>
                 Sunset:
                ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}
            </p>

        </div>

    `;
}

function saveSearch(city) {

    let searches =
        JSON.parse(
            localStorage.getItem("searches")
        ) || [];

    if (!searches.includes(city)) {
        searches.unshift(city);
    }

    searches = searches.slice(0, 5);

    localStorage.setItem(
        "searches",
        JSON.stringify(searches)
    );

    showRecentSearches();
}

function showRecentSearches() {

    const recentDiv =
        document.getElementById("recentSearches");

    let searches =
        JSON.parse(
            localStorage.getItem("searches")
        ) || [];

    let html =
        "<h3>Recent Searches</h3>";

    searches.forEach(city => {

        html += `
            <button
                class="recent-btn"
                onclick="searchCity('${city}')">
                ${city}
            </button>
        `;
    });

    recentDiv.innerHTML = html;
}

function searchCity(city) {

    cityInput.value = city;

    getWeather();
}

showRecentSearches();

window.onload = () => {

    cityInput.value = "Pune";

    getWeather();

};