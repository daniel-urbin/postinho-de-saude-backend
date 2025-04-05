import express, { Request, Response } from 'express';
import supabase from './supabase.config';

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

let usuarios = [
  {
    id: 1,
    nome: "UsuarioInicial",
    email: "teste1@teste.com",
  }
];

// GET lista de usuarios
app.get('/usuarios', (req: Request, res: Response) => {
  res.json(usuarios);
});

// GET usuario
app.get("/usuario/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) {
    res.status(404).send({ mensagem: "Usuário não encontrado" });
  } else {
    res.send(usuario);
  }
})

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

// PUT /usuario/:id
app.put("/usuario/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const usuario = usuarios.find(u => u.id === id);
  if (!usuario) {
    res.status(404).send({ mensagem: "Usuário não encontrado" });
  } else {
    usuario.nome = req.body.nome;
    res.send(usuario);
  }
})

// DELETE /usuario/:id
app.delete("/usuario/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const indice = usuarios.findIndex(u => u.id === id);
  if (indice === -1) {
    res.status(404).send({ mensagem: "Usuário não encontrado" });
  }
  else if (id === 1){
    res.status(401).send({ mensagem: "Usuário com id: 1 não pode ser excluir é o usuario inicial para testes! " });

  } else {
    usuarios.splice(indice, 1);
    res.send({ mensagem: "Usuário excluído com sucesso" });
  }
})

// Novo endpoint GET para ler a tabela "usuario" do Supabase
app.get('/supabase/usuarios', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('*');

    if (error) {
      res.status(500).send({ mensagem: "Erro ao ler a tabela 'usuario'" });
    } else {
      console.log("conectando a base de dados...")
      res.json(data);
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao ler a tabela 'usuario'" });
  }
})

// Esta parte es crucial para el Vercel saber cuál puerto usar
app.listen(port, () => {
  console.log(`Exemplo app escutando porta ${port}`);
});