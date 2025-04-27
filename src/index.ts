import express from 'express';
import usuariosRouter from './routes/usuarios';
import authRouter from './routes/auth';
import unitsRouter from './routes/units';
import professionalsRouter from './routes/professionals';
import appointmentsRouter from './routes/appointments';
import specialtiesRouter from './routes/specialties'; // Importar a nova rota
import apiInfo from './routes/apiInfo'

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear o corpo das solicitações
app.use(express.json());
app.use(apiInfo);

const apiV1Router = express.Router();
apiV1Router.use('/usuarios', usuariosRouter);
apiV1Router.use('/auth', authRouter);
apiV1Router.use('/units', unitsRouter);
apiV1Router.use('/professionals', professionalsRouter);
apiV1Router.use('/appointments', appointmentsRouter);
apiV1Router.use('/specialties', specialtiesRouter);


// so para teste
apiV1Router.get('/teste', (req, res) => {
  res.json({ message: 'API v1 funcionando corretamente!' });
});

app.use('/api/v1', apiV1Router);

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});