import cors from "cors";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();

let cityKey = null;
let cityWeather = null;
let cityName = null;
let cityData = null;
let cityCountry = null;

app.use(cors());
app.use(express.json());

app.get("/health", (request, response) =>
  response.status(200).json({
    message: "OK!",
  })
);

// Middleware para processar o JSON
app.use(bodyParser.json());

app.post("/sendText", (request, response) => {
  const text = request.body.cityText;

  console.log("Texto recebido:", text);

  cityName = text;

  response.json({ mensagem: "Texto recebido com sucesso!", textReceived: cityName });
});

app.get("/", async (request, response) => {
  try {
    const cityInformation = await axios.get(
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.APIKEY}&q=${cityName}`
    );

    cityKey = cityInformation.data[0].Key;
    cityData = cityInformation.data[0].EnglishName;
    cityCountry = cityInformation.data[0].Country.EnglishName;

    response.json({
      message: "Os dados da cidade foram buscados com sucesso",
      textReceived: cityName,
      locationKey: cityKey,
      locationData: cityData,
      locationCountry: cityCountry
    });
  } catch (error) {
    response.status(500).json({
      message: "Erro ao buscar os dados da cidade",
      error: error.message,
    });
  }
});

app.get("/getWeather", async (request, response) => {
  try {
    
    const cityWeatherInformation = await axios.get(
      `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${process.env.APIKEY}`
    );
    
    cityWeather = cityWeatherInformation.data;

    response.json({
      message: "Dados da cidade encontrados",
      locationData: cityData,
      locationCountry: cityCountry,
      weatherData: cityWeather,
    });
  } catch (error) {
    response.status(404).json({
      message: "Nenhum dado foi encontrado",
      error: error.message,
    });
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Executando o servidor na porta ${process.env.PORT}`)
);
