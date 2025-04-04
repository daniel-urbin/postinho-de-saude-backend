import { DataSource } from 'typeorm';
import { Usuario } from '../models/usuario';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [Usuario],
  migrations: [],
  subscribers: [],
});
