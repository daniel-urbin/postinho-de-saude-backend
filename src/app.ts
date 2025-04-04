import express from 'express';
import usuarioRoutes from './routes/usuario';
import { AppDataSource } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', usuarioRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
