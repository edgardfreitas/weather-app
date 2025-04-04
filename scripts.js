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
        alert("A cidade não foi encontrada!")
        throw new Error("Erro ao buscar a cidade. Tente novamente.");
      }

      console.log("Cidade encontrada:", cityData.textReceived);
      console.log("Chave da cidade:", cityData.locationKey);

      return fetch("http://localhost:3333/getWeather");
    })
    .then((response) => response.json())
    .then((weatherData) => {
      if (weatherData.weatherData) {
        function isDayTime() {
          return weatherData.weatherData[0].IsDayTime == true ? "Dia 🌞" : "Noite 🌜";
        }
        
        const cityMessage = `${weatherData.locationData}, ${weatherData.locationCountry}`;
        document.getElementById("displayCityText").textContent =
          cityMessage;

        const dayTimeMessage = `${isDayTime()}`;
        document.getElementById("displayDayTimeText").textContent =
          dayTimeMessage;

        const temperatureMessage = `${weatherData.weatherData[0].Temperature.Metric.Value} ºC 🌡️`;
        document.getElementById("displayTemperatureText").textContent =
          temperatureMessage;

        const weatherMessage = `${weatherData.weatherData[0].WeatherText}`;
        document.getElementById("displayWeatherText").textContent =
          weatherMessage;
        
        document.getElementById("textCard").style.display = "block";
        document.getElementById("loader").style.display = "none";
      } else {
        document.getElementById("loader").style.display = "none";
        alert("Nenhuma informação de clima disponível.");
      }
    })
    .catch((error) => console.error("Erro:", error));
});
