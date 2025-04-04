import supabase from '../supabase.config';
import { Usuario } from '../models/usuario.model';

const getDados = async () => {
  const { data, error } = await supabase
    .from('tabela')
    .select('*');

  if (error) {
    console.error(error);
  } else {
    return data;
  }
};

export class SupabaseService {
  async criarUsuario(nome: string, email: string) {
    const usuario = await Usuario.create({
      data: {
        nome,
        email,
      },
    });
    return usuario;
  }
}

export { getDados };