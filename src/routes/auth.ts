import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import supabase from '../configs/supabase.config';
import { enviarEmail } from '../helpers/emailHelper';
import { enviarErro500 } from '../helpers/responseHelpers';

const router = express.Router();


// POST register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, document, phone, birthdate, address, role } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    const { zip_code, street, number, district, city, state } = address;

    const { data: addressData, error: addressError } = await supabase
      .from('endereco')
      .insert([
        {
          cep: zip_code,
          rua: street,
          numero: number,
          bairro: district,
          cidade: city,
          estado: state
        }
      ]);

    if (addressError) {
      console.log(addressError);
      res.status(409).json({ mensagem: 'Erro ao registrar o endereço' });
      return;
    }

    const { id: addressId } = addressData![0];

    const { data, error } = await supabase
      .from('usuario')
      .insert([
        { 
          nome: name,
          email,
          senha: encryptedPassword,
          documento: document,
          telefone: phone,
          dataNascimento: birthdate,
          endereco_id: addressId,
          tipo: role
        },
      ]);

    if (error) {
      console.log(error);
      if (addressId) {
        await supabase.from('endereco').delete().eq('id', addressId);
      }
      res.status(409).json({ mensagem: 'Erro ao registrar o usuário' });
      return;
    }

    res.status(201).json({ mensagem: 'Usuário registrado com sucesso', data });
  } catch (error) {
    enviarErro500("Erro ao registrar o usuário")(res);
  }
});

// Endpoint de login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password: senha } = req.body;

    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('email', email);

    if (error) {
      res.status(500).send({ mensagem: "Erro ao acessar a tabela 'usuario'" });
      return;
    }

    if (!data || data.length === 0) {
      res.status(401).json({ error: 'Credenciais inválidas' });
      return;
    }

    const user = data[0];
    const passwordMatch = await bcrypt.compare(senha, user.senha);


    if (!passwordMatch) {
      res.status(422).json({ error: 'Email ou senha incorretos!' });
      return;
    }

    const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY!, {
      expiresIn: '30d',
    });

    const enderecoid: number = user.endereco_id || 1;

    const { data: dataEndereco, error: erroEndereco } = await supabase
      .from('endereco')
      .select('*')
     // .eq('id', enderecoid)
      .single();


    if (erroEndereco) {
      res.status(500).send({ mensagem: "Erro ao acessar a tabela 'endereco'" });
      return;
    }

  let usuarioEndereco = {
          endereco_id:1,
          cep:"123", 
          estado:"123",
          cidade:"123",
          bairro:"123", 
          rua:"123", 
          numero:"123",
          criado_em:"123",
          atualizado_em:"123",
        };
 
   if (dataEndereco) {
    usuarioEndereco = dataEndereco;
   }

console.log("deploy 4");
console.log(dataEndereco);
console.log(usuarioEndereco);
console.log(usuarioEndereco.cep);
    // Retornar os campos esperados no formato correto
    res.json({
      token,
      user: {
        id: user.id,
        address: {
          id: user.endereco_id,
          zipCode: usuarioEndereco.cep, 
          state: usuarioEndereco.estado,
          city: usuarioEndereco.cidade,
          district: usuarioEndereco.bairro, 
          street: usuarioEndereco.rua, 
          number: usuarioEndereco.numero,
          createdAt: usuarioEndereco.criado_em,
          updatedAt: usuarioEndereco.atualizado_em,
        },
        name: user.nome,
        email: user.email,
        phone: user.telefone,
        birthdate: user.data_nascimento,
        document: user.cpf,
        role: user.tipo,
//        admin: user.tipo === 'admin' ? user.id : null,
//        doctor: user.tipo === 'medico' ? user.id : null,
//        patient: user.tipo === 'paciente' ? user.id : null,
        createdAt: user.criado_em, 
        updatedAt: user.atualizado_em, 
      },

    });
  } catch (error) {

    res.status(500).send({ mensagem: `Erro ao autenticar o usuário ${error}` });
  }
});

// Endpoint protegido
router.get('/protected', (req: Request, res: Response) => {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;
    res.json({ message: `Olá, ${decoded.email}!` });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});

// Endpoint para recuperação de senha
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const { data, error } = await supabase
      .from('usuario')
      .select('id')
      .eq('email', email);

    if (error || !data || data.length === 0) {
      res.status(404).json({ mensagem: 'E-mail não encontrado' });
      return;
    }

    const codigoRecuperacao = Math.floor(100000 + Math.random() * 900000).toString();

    await enviarEmail(email, 'Recuperação de Senha', `Seu código de recuperação é: ${codigoRecuperacao}`);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ mensagem: `Erro ao enviar e-mail de recuperação: ${error}` });
  }
});

export default router;