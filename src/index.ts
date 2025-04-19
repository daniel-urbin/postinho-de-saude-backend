import express, { Request, Response } from 'express';
import usuariosRouter from './routes/usuarios';
import autenticarRouter from './routes/autenticar';
import utilidadesRouter from './routes/apiInfo';
import zohoVerifyRouter from './routes/zohoVerify'; // Importar a nova rota

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear o corpo das solicitações
app.use(express.json());
app.use(usuariosRouter);
app.use(autenticarRouter);
app.use(utilidadesRouter);
app.use(zohoVerifyRouter); // Registrar a nova rota

// Esta parte é crucial para o Vercel saber qual porta usar
app.listen(port, () => {
  console.log(`Exemplo app escutando porta ${port}`);
});