import express from 'express';
import usuariosRouter from './routes/usuarios';
import authRouter from './routes/auth';
import unitsRouter from './routes/units';
import professionalsRouter from './routes/professionals';
import appointmentsRouter from './routes/appointments';
import specialtiesRouter from './routes/specialties'; // Importar a nova rota

const app = express();
const port = process.env.PORT || 3001;

// Middleware para parsear o corpo das solicitações
app.use(express.json());
app.use(usuariosRouter);
app.use(authRouter);
app.use(unitsRouter);
app.use(professionalsRouter);
app.use(appointmentsRouter);
app.use(specialtiesRouter); // Registrar a nova rota

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});