import cors from 'cors';
import express from 'express';
import axios from 'axios';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (request, response) => response.status(200).json({
  message: "OK!"
}));

app.get('/', async (request, response) => {

  try {
    // response é a resposta do axios MAS eu tiro o data de dentro do response
    const { data } = await axios('http://dataservice.accuweather.com/locations/v1/search?q=riodejaneiro&apikey={vLLkxz7OYYLm4ybXF7FElwIP0PGlWNVa}')

    return response.json(data);
  } catch (error) {
    console.log(error);
  }
  
});

const PORT = 3333
app.listen(PORT, () => console.log(`Executando o servidor na porta ${PORT}`));