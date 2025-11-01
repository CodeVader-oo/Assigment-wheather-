const input = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const container = document.getElementById("weatherContainer");
const locationInfo = document.getElementById("locationInfo");


const API_KEY = "d1fcd1d6c18440eebed85442250111";


const toggle = document.querySelector(".theme-toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = toggle.querySelector("i");
  icon.classList.toggle("fa-sun");
  icon.classList.toggle("fa-moon");
});


async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=3`
    );
    const data = await res.json();
    showWeather(data);
  } catch (error) {
    container.innerHTML = `<p class="text-white">Error fetching data!</p>`;
  }
}


function showWeather(data) {
  if (!data || !data.forecast) {
    container.innerHTML = `<p class="text-white">City not found!</p>`;
    return;
  }

  const locationName = `${data.location.name}, ${data.location.country}`;
  locationInfo.innerHTML = `<h4><i class="fa-solid fa-location-dot"></i> ${locationName}</h4>`;

  const days = data.forecast.forecastday;
  container.innerHTML = "";

  days.forEach((day) => {
    const date = new Date(day.date);
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
    const icon = `https:${day.day.condition.icon.replace("64x64", "128x128")}`; // HD icons

    const card = `
      <div class="col-md-3 m-2">
        <div class="card shadow-sm">
          <h5>${weekday}</h5>
          <img src="${icon}" alt="${day.day.condition.text}">
          <p class="mt-2">${day.day.condition.text}</p>
          <p><i class="fa-solid fa-temperature-high"></i> Max: ${day.day.maxtemp_c}°C</p>
          <p><i class="fa-solid fa-temperature-low"></i> Min: ${day.day.mintemp_c}°C</p>
          <p><i class="fa-solid fa-wind"></i> Wind: ${day.day.maxwind_kph} km/h</p>
          <p><i class="fa-solid fa-compass"></i> Direction: ${day.hour[0].wind_dir}</p>
        </div>
      </div>
    `;
    container.innerHTML += card;
  });
}

searchBtn.addEventListener("click", () => {
  const city = input.value.trim();
  if (city !== "") getWeather(city);
});


window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      getWeather(`${latitude},${longitude}`);
    });
  }
});
