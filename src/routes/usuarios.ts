import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import supabase from '../configs/supabase.config';
import { tratarResposta } from '../handlers/tratarResposta';
import { Usuario } from '../models/usuario';
import { TDataErro } from '../models/types';
import { enviarErro500 } from '../helpers/responseHelpers';
import { enviarEmail } from '../helpers/emailHelper';

const router = express.Router();

// GET lista de usuarios
router.get('/usuarios', async (req: Request, res: Response) => {
  try {
    let DataErro: TDataErro;

    DataErro = await supabase.from('usuario').select('*');

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
router.get('/usuario/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    let DataErro: TDataErro;

    DataErro = await supabase.from('usuario').select('*').eq('id', id);

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

// POST usuario
router.post('/usuario', async (req: Request, res: Response) => {
  try {
    const usu: Usuario = req.body as Usuario;
    usu.senha = await bcrypt.hash(usu.senha, 10);
    let DataErro: TDataErro;

    DataErro = await supabase.from('usuario').insert([usu]);

    const resp = tratarResposta(DataErro, false, false);
    if (resp.mensagem) {
      res.status(resp.status).send({ mensagem: resp.mensagem });
    } else {
      res.status(resp.status).json(resp.dados);
    }
  } catch (error) {
    enviarErro500('Erro ao inserir o usuário')(res);
  }
});

// PUT /usuario/:id
router.put('/usuario/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { nome, email, senha, documento, telefone, dataNascimento, endereco_id } = req.body;
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
        documento,
        telefone,
        dataNascimento,
        endereco_id,
      })
      .eq('id', id);

    const resp = tratarResposta(DataErro, false, false);
    if (resp.mensagem) {
      res.status(resp.status).send({ mensagem: resp.mensagem });
    } else {
      res.status(resp.status).json(resp.dados);
    }
  } catch (error) {
    enviarErro500('Erro ao atualizar o usuário')(res);
  }
});

// DELETE /usuario/:id
router.delete('/usuario/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    let DataErro: TDataErro;

    DataErro = await supabase.from('usuario').delete().eq('id', id);

    const resp = tratarResposta(DataErro, false, true);
    if (resp.mensagem) {
      res.status(resp.status).send({ mensagem: resp.mensagem });
    } else {
      res.status(resp.status).json(resp.dados);
    }
  } catch (error) {
    enviarErro500('Erro ao excluir o usuário')(res);
  }
});

// POST reset-password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, novaSenha, codigoRecuperacao } = req.body;

    // Verificar se o código de recuperação é válido (exemplo fictício)
    if (codigoRecuperacao !== '123456') {
      res.status(400).json({ mensagem: 'Código de recuperação inválido' });
      return;
    }

    // Criptografar a nova senha
    const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

    // Atualizar a senha no banco de dados
    const { data, error } = await supabase
      .from('usuario')
      .update({ senha: senhaCriptografada })
      .eq('email', email);

    if (error || !data) {
      res.status(404).json({ mensagem: 'Usuário não encontrado ou erro ao redefinir senha' });
      return;
    }

    // Retornar status 204 sem conteúdo
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao redefinir a senha' });
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
    enviarErro500('Erro ao verificar o código')(res);
  }
});

// POST forgot-password
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Verificar se o e-mail existe no banco de dados
    const { data, error } = await supabase.from('usuario').select('id').eq('email', email);

    if (error || !data || data.length === 0) {
      res.status(404).json({ mensagem: 'E-mail não encontrado' });
      return;
    }

    // Gerar um código de recuperação (exemplo simples)
    const codigoRecuperacao = Math.floor(100000 + Math.random() * 900000).toString();

    // Enviar o e-mail com o código de recuperação
    await enviarEmail(
      email,
      'Recuperação de Senha',
      `Seu código de recuperação é: ${codigoRecuperacao}`,
    );

    // Retornar status 204 sem conteúdo
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao enviar e-mail de recuperação teste_123: ${error}` });
  }
});

export default router;
