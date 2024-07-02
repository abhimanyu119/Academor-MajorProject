const apiKey = "c58a8fecf2ce49fa855225332240207";
const showCityName = document.getElementById("cityName");
const input = document.getElementById("cityInput");
let currentWeatherUrl;
let forecastUrl;
document.getElementById("fetchWeatherBtn").addEventListener("click", function () {
  const city = document.getElementById("cityInput").value;
  if (city === "") {
    input.setCustomValidity("Please enter a city");
    input.reportValidity();
    return;
  }
  else {
    currentWeatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`;
    getWeatherData(currentWeatherUrl);
  }
});
input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("fetchWeatherBtn").click();
  }
});
document.getElementById("currentCityBtn").addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    currentWeatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`;
    forecastUrl = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lon}&days=7`;
    getWeatherData(currentWeatherUrl);
  });
});

function getWeatherData() {
  fetch(currentWeatherUrl)
    .then((response) => {
      if (response.status === 400) {
        input.setCustomValidity("Please enter a valid city");
        input.reportValidity();
        throw new Error("Invalid city");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById(
        "weatherCondition"
      ).textContent = `Condition: ${data.current.condition.text}`;
      document.getElementById(
        "temperature"
      ).textContent = `Temperature: ${data.current.temp_c}°C`;
      document.getElementById(
        "humidity"
      ).textContent = `Humidity: ${data.current.humidity}%`;
      document.getElementById(
        "windSpeed"
      ).textContent = `Wind Speed: ${data.current.wind_kph} kph`;
      document.getElementById(
        "dateTime"
      ).textContent = `Date & Time: ${data.location.localtime}`;
      showCityName.innerText = `${data.location.name}, ${data.location.region}, ${data.location.country}`;
    })
    .catch((error) => {
      console.error(error);
    });

  fetch(forecastUrl)
    .then((response) => response.json())
    .then((data) => {
      const dates = data.forecast.forecastday.map((item) => item.date);
      const temperatures = data.forecast.forecastday.map(
        (item) => item.day.avgtemp_c
      );
      const humidities = data.forecast.forecastday.map(
        (item) => item.day.avghumidity
      );
      const conditions = data.forecast.forecastday.map(
        (item) => item.day.condition.text
      );

      const ctx = document.getElementById("forecastChart").getContext("2d");
      if (typeof chart !== "undefined") {
        chart.destroy();
      }
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [
            {
              label: "Temperature (°C)",
              data: temperatures,
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
              fill: false,
            },
            {
              label: "Humidity (%)",
              data: humidities,
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
}
