import express, { Request, Response } from 'express';
import usuariosRouter from './routes/usuarios';

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use('/api', usuariosRouter);

// Esta parte es crucial para el Vercel saber cuál puerto usar
app.listen(port, () => {
  console.log(`Exemplo app escutando porta ${port}`);
});