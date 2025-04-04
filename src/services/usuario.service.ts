import { Injectable } from '@nestjs/common';
import { UsuarioRepository } from '../repositories/usuario.repository';

@Injectable()
export class UsuarioService {
  constructor(private readonly usuarioRepository: UsuarioRepository) {}

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find();
  }
}