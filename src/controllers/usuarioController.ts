import { Request, Response } from 'express';
import { getUsuarios } from '../services/usuarioService';

export const listarUsuarios = async (req: Request, res: Response) => {
  const usuarios = await getUsuarios();
  res.json(usuarios);
};
