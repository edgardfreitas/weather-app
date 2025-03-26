import cors from 'cors';
import express from 'express';
import axios from 'axios';

const app = express();

let cityKey = null;
let cityWeather = null;

app.use(cors());
app.use(express.json());

app.get('/health', (request, response) => response.status(200).json({
  message: "OK!"
}));

app.get('/', async (request, response) => {
  try {

    const cityInformation = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.APIKEY}&q=saogoncalo`) // A cidade está mockada

    cityKey = cityInformation.data[0].Key;

    response.json({
      message: 'Os dados da cidade foram buscados com sucesso',
      locationKey: cityKey
    });

  } catch (error) {

    response.status(500).json({
      message: 'Erro ao buscar os dados da cidade',
      error: error.message
    });

  }
  
});

app.get('/1day', async (request, response) => {
  try {
    
    const cityWeatherInformation = await axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${cityKey}?apikey=${process.env.APIKEY}`);

    cityWeather = cityWeatherInformation.data;

    response.json({
      message: 'Dados da cidade encontrados',
      weatherData: cityWeather
      
    })

  } catch (error) {

    response.status(404).json({
      message: 'Nenhum dado foi encontrado',
      error: error.message
    })

  }
  
});

app.listen(process.env.PORT, () => console.log(`Executando o servidor na porta ${process.env.PORT}`));
