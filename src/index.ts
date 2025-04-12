import express, { Request, Response } from 'express';
import usuariosRouter from './routes/usuarios';
import autenticarRouter from './routes/autenticar';
import utilidadesRouter from './routes/apiInfo';

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear el cuerpo de las solicitudes
app.use(express.json());
app.use(usuariosRouter);
app.use(autenticarRouter);
app.use(utilidadesRouter);

// Esta parte es crucial para el Vercel saber cuál puerto usar
app.listen(port, () => {
  console.log(`Exemplo app escutando porta ${port}`);
});