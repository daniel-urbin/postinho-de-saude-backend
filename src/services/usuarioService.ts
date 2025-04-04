import { AppDataSource } from '../config/database';
import { Usuario } from '../models/usuario';

export const getUsuarios = async () => {
  const usuarioRepository = AppDataSource.getRepository(Usuario);
  return await usuarioRepository.find();
};
