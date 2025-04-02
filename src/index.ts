import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World from TypeScript API!');
});

app.get('/usuario',(req: Request, res: Response) => {
  const usuario = {
    id: 1,
    nome: 'Joao',
    email: 'teste@teste.com'
  }

  res.json(usuario);
});

// Esta parte é crucial para o Vercel saber qual porta usar
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
