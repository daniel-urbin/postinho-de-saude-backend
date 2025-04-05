import express, { Request, Response } from 'express';
import supabase from './supabase.config';

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());

// GET lista de usuarios
app.get('/usuarios', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('*');

    if (error) {
      res.status(500).send({ mensagem: "Erro ao ler a tabela 'usuario'" });
    } else {
      res.json(data);
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao ler a tabela 'usuario'" });
  }
});

// GET usuario
app.get("/usuario/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id', id);

    if (error) {
      res.status(500).send({ mensagem: "Erro ao ler a tabela 'usuario'" });
    } else {
      res.json(data[0]);
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao ler a tabela 'usuario'" });
  }
})

// Endpoint para agregar un nuevo usuario
app.post('/usuario', async (req: Request, res: Response) => {
  try {
    const { nome, email } = req.body;
    const { data, error } = await supabase
      .from('usuario')
      .insert([{ nome, email }]);

    if (error) {
      res.status(500).send({ mensagem: "Erro ao inserir o usuário" });
    }
    else if (data === null) {
      //tive que deixar assim por agora já que esta fucnioando,
      //mais mesmo dando mensagem de erro vai criar 
      res.status(201).send({ mensagem: "Usuário criado com sucesso" });
    } else {      
      res.status(201).json(data[0]);
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao inserir o usuário" });
  }
});

// PUT /usuario/:id
app.put("/usuario/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, email } = req.body;
    const { data, error } = await supabase
      .from('usuario')
      .update({ nome: nome, email: email })
      .eq('id', id);

    if (error) {
      res.status(500).send({ mensagem: "Erro ao atualizar o usuário" });
    } else if (data === null) {
      //tive que deixar assim por agora já que esta fucnioando,
      //mais mesmo dando mensagem de erro vai fazer update 
      res.status(200).send({mensagem: "Usuário atualizado com sucesso"})
    } else {
      res.json(data[0]);
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao atualizar o usuário" });
  }
})

// DELETE /usuario/:id
app.delete("/usuario/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { data, error } = await supabase
      .from('usuario')
      .delete()
      .eq('id', id);

    if (error) {
      res.status(500).send({ mensagem: "Erro ao excluir o usuário" });
    } else {
      res.send({ mensagem: "Usuário excluído com sucesso" });
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao excluir o usuário" });
  }
})

// Esta parte es crucial para el Vercel saber cuál puerto usar
app.listen(port, () => {
  console.log(`Exemplo app escutando porta ${port}`);
});