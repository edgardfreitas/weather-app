import express from 'express';
import city from '.routes/city';

const app = express();

app.use(express.json());

app.get('/', (request, response) => response.status(200).json({
  message: "OK!"
}));

app.use('/profile', city);

const PORT = 3333
app.listen(PORT, () => console.log(`Executando o servidor na porta ${PORT}`));