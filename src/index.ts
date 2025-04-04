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
  res.send('endpoint disponible para pruebas: '+
           '[GET] /usuario //retorna o listado de usarios' +
           '[POST] /usuario //enviar json no body com campos nome e email');
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


// Endpoint para eliminar un usuario
// app.delete("/usuario/:id", (req: Request, res: Response) => {
//     //const { id } = parseInt(req.params.id);
//     const id: any = req.params.id;
//     const index = usuarios.findIndex(usuario => usuario.id === parseInt(id)); // Convertir id a número

//     if (index !== -1) {
//         usuarios.splice(index, 1);
//         return res.status(200).send({ message: 'Usuario eliminado con éxito' });
//     } else {
//         return res.status(404).send({ message: 'Usuario no encontrado' });
//     }
// });




// Esta parte es crucial para el Vercel saber cuál puerto usar
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});