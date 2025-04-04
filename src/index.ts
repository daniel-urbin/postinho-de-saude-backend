import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

let usuarios = [
  {
    id: 1,
    nome: 'UsuarioInicial',
    email: 'teste1@teste.com',
  }
];

app.get('/', (req: Request, res: Response) => {
  res.send('endpoint disponible para pruebas: [GET] /usuario, [POST] /usuario');
});

// Endpoint para obtener la lista de usuarios
app.get('/usuario', (req: Request, res: Response) => {
  res.json(usuarios);
});

// Endpoint para agregar un nuevo usuario
app.post('/usuario', (req: Request, res: Response) => {
  const { nome, email } = req.body;

  // Generar un nuevo ID
  const newId = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;

  const newUser = {
    id: newId,
    nome,
    email,
  };

  usuarios.push(newUser);
  res.status(201).json(newUser);
});

// Esta parte es crucial para el Vercel saber cuál puerto usar
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});