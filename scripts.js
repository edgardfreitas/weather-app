window.addEventListener("DOMContentLoaded", () => {
  const savedText = localStorage.getItem("cityString");
  if (savedText) {
    document.getElementById("textbox").value = savedText;
  }
});

document.getElementById("textbox").addEventListener("input", () => {
  const currentValue = document.getElementById("textbox").value;
  localStorage.setItem("cityString", currentValue);
});

document.getElementById("submitButton").addEventListener("click", () => {
  const cityText = document.getElementById("textbox").value.trim();
  
  if (!cityText) {
    alert("Digite uma cidade!");
    return;
  }

  fetch("http://localhost:3333/sendText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cityText: cityText }),
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("textCard").style.display = "none";
      document.getElementById("loader").style.display = "block";

      console.log("Cidade enviada:", data.textReceived);

      return fetch("http://localhost:3333/");
    })
    .then((response) => response.json())
    .then((cityData) => {
      if (!cityData.locationKey) {
        document.getElementById("loader").style.display = "none";
        alert("A cidade não foi encontrada!");
        throw new Error("Erro ao buscar a cidade. Tente novamente.");
      }

      console.log("Cidade encontrada:", cityData.textReceived);
      console.log("Chave da cidade:", cityData.locationKey);

      return fetch("http://localhost:3333/getWeather");
    })
    .then((response) => response.json())
    .then((weatherData) => {
      if (weatherData.weatherData) {
        function isDayTime () {
          if (weatherData.weatherData[0].IsDayTime == true) {
            document.body.id = "dayBodyId";
            document.getElementById("submitButton").className = "btn btn-primary w-100";
            return "Dia 🌞";
          }
          document.body.id = "nightBodyId";
          document.getElementById("submitButton").className = "btn btn-dark w-100";
          return "Noite 🌜";
        }

        const cityMessage = `${weatherData.locationData}, ${weatherData.locationCountry}`;
        document.getElementById("displayCityText").textContent = cityMessage;

        const dayTimeMessage = `${isDayTime()}`;
        document.getElementById("displayDayTimeText").textContent =
          dayTimeMessage;

        const temperatureMessage = `${weatherData.weatherData[0].Temperature.Metric.Value} ºC 🌡️`;
        document.getElementById("displayTemperatureText").textContent =
          temperatureMessage;

        const weatherMessage = `${weatherData.weatherData[0].WeatherText}`;
        document.getElementById("displayWeatherText").textContent =
          weatherMessage;

        function weatherIconNumber(weatherIcon) {
          const iconNumber = Number(weatherIcon);
        
          const validIcons = new Set([
            1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 13, 14,
            15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
            25, 26, 29, 30, 31, 32, 33, 34, 35, 36,
            37, 38, 39, 40, 41, 42, 43, 44
          ]);
        
          if (validIcons.has(iconNumber)) {
            return `assets/images/${iconNumber}.svg`;
          } else {
            return "assets/images/default.svg";
          }
        }

        const iconNumber = weatherData.weatherData[0].WeatherIcon;
        const iconPath = weatherIconNumber(iconNumber);
        const img = document.getElementById("displayWeatherIcon");
        img.src = iconPath;

        document.getElementById("textCard").style.display = "block";
        document.getElementById("loader").style.display = "none";
      } else {
        document.getElementById("loader").style.display = "none";
        alert("Nenhuma informação de clima disponível.");
      }
    })
    .catch((error) => console.error("Erro:", error));
});
