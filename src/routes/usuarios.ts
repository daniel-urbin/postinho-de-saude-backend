import express, { Request, Response } from 'express';
import supabase from '../supabase.config';
import bcrypt from 'bcryptjs';

const router = express.Router();


// GET lista de usuarios
router.get('/usuarios', async (req: Request, res: Response) => {
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
router.get("/usuario/:id", async (req: Request, res: Response) => {
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
router.post('/usuario', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, cpf, telefone, dataNascimento, endereco } = req.body;
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const { data, error } = await supabase
      .from('usuario')
      .insert([{ nome, email, senha: senhaCriptografada, cpf, telefone, dataNascimento, endereco }]);

    if (error) {
      res.status(500).send({ mensagem: "Erro ao inserir o usuário" });
    }
    else if (data === null) {
      res.status(201).send({ mensagem: "Usuário criado com sucesso" });
    } else {      
      res.status(201).json(data[0]);
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao inserir o usuário" });
  }
});

// PUT /usuario/:id
router.put("/usuario/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, email, senha, cpf, telefone, dataNascimento, endereco } = req.body;
    let senhaCriptografada;
    if (senha) {
      senhaCriptografada = await bcrypt.hash(senha, 10);
    }
    const { data, error } = await supabase
      .from('usuario')
      .update({ 
        nome, 
        email, 
        senha: senhaCriptografada || undefined, 
        cpf, 
        telefone, 
        dataNascimento, 
        endereco 
      })
      .eq('id', id);

    if (error) {
      res.status(500).send({ mensagem: "Erro ao atualizar o usuário" });
    } else if (data === null) {
      res.status(200).send({mensagem: "Usuário atualizado com sucesso"})
    } else {
      res.json(data[0]);
    }
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao atualizar o usuário" });
  }
})


// DELETE /usuario/:id
router.delete("/usuario/:id", async (req: Request, res: Response) => {
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


export default router;