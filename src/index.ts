import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('endpoint disponivel para testes:[GET] /usuario');
});

app.get('/usuario',(req: Request, res: Response) => {
  const usuario1 = [
    {
    id: 1,
    nome: 'Joao',
    email: 'teste1@teste.com'
    },
    {
    id: 2,
    nome: 'Pedro',
    email: 'teste2@teste.com'
    },
    {
    id: 3,
    nome: 'Maria',
    email: 'teste3@teste.com'
    }
    
  ]

  res.json(usuario1);
});

//app.get('/usuarios', async (req: Request, res: Response) => {
//  const usuarios = await prisma.usuario.findMany();
//  res.json(usuarios);
//});

// Esta parte é crucial para o Vercel saber qual porta usar
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
