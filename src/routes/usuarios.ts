import express, { Request, Response } from 'express';
import supabase from '../configs/supabase.config';
import bcrypt from 'bcryptjs';
import { tratarResposta } from '../handlers/tratarResposta';
import { Usuario } from '../models/usuario';
import { TDataErro } from '../models/types';
import { enviarErro500 } from '../helpers/responseHelpers';

const router = express.Router();

// GET lista de usuarios
router.get('/usuarios', async (req: Request, res: Response) => {
  try {
    let DataErro: TDataErro;

    DataErro = await supabase
      .from('usuario')
      .select('*');

    const resp = tratarResposta(DataErro, true, false);
    if (resp.mensagem) {
      res.status(resp.status).send({ mensagem: resp.mensagem });
    } else {
      res.status(resp.status).json(resp.dados);
    }

  } catch (error) {
    enviarErro500("Erro ao ler a tabela 'usuario'")(res);
  }
});

// GET usuario
router.get("/usuario/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    let DataErro: TDataErro;

    DataErro = await supabase
      .from('usuario')
      .select('*')
      .eq('id', id);

    const resp = tratarResposta(DataErro, true, false);
    if (resp.mensagem) {
      res.status(resp.status).send({ mensagem: resp.mensagem });
    } else {
      res.status(resp.status).json(resp.dados);
    }

  } catch (error) {
    enviarErro500("Erro ao ler a tabela 'usuario'")(res);
  }
})

// POST usuario
router.post('/usuario', async (req: Request, res: Response) => {

  try {
    const usu: Usuario = req.body as Usuario;
    usu.senha = await bcrypt.hash(usu.senha, 10);
    let DataErro: TDataErro;

    DataErro = await supabase
      .from('usuario')
      .insert([usu]);

    const resp = tratarResposta(DataErro, false, false);
    if (resp.mensagem) {
      res.status(resp.status).send({ mensagem: resp.mensagem });
    } else {
      res.status(resp.status).json(resp.dados);
    }

  } catch (error) {
    enviarErro500("Erro ao inserir o usuário")(res);
  }
});

// POST register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, cpf, telefone, dataNascimento, endereco } = req.body;

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from('usuario')
      .insert([
        { nome, email, senha: senhaCriptografada, cpf, telefone, dataNascimento, endereco },
      ]);

    if (error) {
      res.status(409).json({ mensagem: 'Erro ao registrar o usuário' });
      return;
    }

    res.status(201).json({ mensagem: 'Usuário registrado com sucesso', data });
  } catch (error) {
    enviarErro500("Erro ao registrar o usuário")(res);
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
    let DataErro: TDataErro;

    DataErro = await supabase
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

    const resp = tratarResposta(DataErro, false, false);
    if (resp.mensagem) {
      res.status(resp.status).send({ mensagem: resp.mensagem });
    } else {
      res.status(resp.status).json(resp.dados);
    }

  } catch (error) {
    enviarErro500("Erro ao atualizar o usuário")(res);
  }
})

// DELETE /usuario/:id
router.delete("/usuario/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    let DataErro: TDataErro;

    DataErro = await supabase
      .from('usuario')
      .delete()
      .eq('id', id);

    const resp = tratarResposta(DataErro, false, true);
    if (resp.mensagem) {
      res.status(resp.status).send({ mensagem: resp.mensagem });
    } else {
      res.status(resp.status).json(resp.dados);
    }

  } catch (error) {
    enviarErro500("Erro ao excluir o usuário")(res);
  }
})

// POST reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, novaSenha } = req.body;

    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    const { data, error } = await supabase
      .from('usuario')
      .update({ senha: senhaCriptografada })
      .eq('email', email);

    if (error || !data) {
      res.status(404).json({ mensagem: 'Usuário não encontrado ou erro ao redefinir senha' });
      return;
    }

    res.status(200).json({ mensagem: 'Senha redefinida com sucesso' });
  } catch (error) {
    enviarErro500("Erro ao redefinir a senha")(res);
  }
});

// POST verify-code
router.post('/verify-code', async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    // Lógica para verificar o código (exemplo fictício)
    if (code === '123456') {
      res.status(200).json({ mensagem: 'Código verificado com sucesso' });
    } else {
      res.status(400).json({ mensagem: 'Código inválido' });
    }
  } catch (error) {
    enviarErro500("Erro ao verificar o código")(res);
  }
});

export default router;
