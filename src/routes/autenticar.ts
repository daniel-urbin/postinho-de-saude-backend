// auth.ts
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Simulação de autenticação (substitua por sua lógica de autenticação real)
  if (username === 'admin' && password === 'password') {
    const token = jwt.sign({ username }, process.env.SECRET_KEY!, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciais inválidas' });
  }
});

router.get('/protected', (req: Request, res: Response) => {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' });
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;
      res.json({ message: `Olá, ${decoded.username}!` });
    } catch (error) {
      res.status(401).json({ error: 'Token inválido' });
    }
  }
});

export default router;