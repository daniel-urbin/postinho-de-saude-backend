import express, { Request, Response } from 'express';
import { prisma } from './prisma';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('endpoint disponiveis para testes: /usuario <-ok e /usuarios <- ainda implementando');
});

app.get('/usuario',(req: Request, res: Response) => {
  const usuario = {
    id: 1,
    nome: 'Joao',
    email: 'teste@teste.com'
  }

  res.json(usuario);
});

app.get('/usuarios', async (req: Request, res: Response) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});

// Esta parte é crucial para o Vercel saber qual porta usar
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
