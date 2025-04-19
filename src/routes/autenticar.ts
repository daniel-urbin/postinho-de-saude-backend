import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import supabase from '../configs/supabase.config';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email);

    if (error) {
      res.status(500).send({ mensagem: "Erro ao acessar a tabela 'usuario'" });
      return;
    }

    if (!data || data.length === 0) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const user = data[0];
    const passwordMatch = await bcrypt.compare(password, user.senha);

    if (!passwordMatch) {
      res.status(422).json({ error: 'Email ou senha incorretos!' });
      return;
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY!, {
      expiresIn: '30d',
    });

    res.json({
      user: {
        id: user.id,
        name: user.nome,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).send({ mensagem: "Erro ao autenticar o usuário" });
  }
});

router.get('/protected', (req: Request, res: Response) => {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;
      res.json({ message: `Olá, ${decoded.nome}!` });
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  }
});

export default router;