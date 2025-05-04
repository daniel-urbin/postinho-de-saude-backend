import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import supabase from '../configs/supabase.config';
import { enviarEmail } from '../helpers/emailHelper';
import { prisma } from '../../prisma/client';
import { Prisma } from '@prisma/client';

const router = express.Router();

const userWithAddress = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: { address: true },
});
type UserWithAddress = Prisma.UserGetPayload<typeof userWithAddress>;

const addressValidator = Prisma.validator<Prisma.AddressDefaultArgs>()({});
type CreatedAddress = Prisma.AddressGetPayload<typeof addressValidator>;

router.post('/register', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      password,
      document,
      phone,
      birthdate,
      address,
      role,
      specialty,
    } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'Endereço é obrigatório.' });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const createdAddress: CreatedAddress = await prisma.address.create({
      data: {
        zipCode: address.zip_code,
        street: address.street,
        number: address.number,
        district: address.district,
        city: address.city,
        state: address.state,
      },
    });

    const createdUser: UserWithAddress = await prisma.user.create({
      data: {
        addressId: createdAddress.id,
        name: name,
        email: email,
        password: encryptedPassword,
        cpf: document,
        phone: phone,
        birthdate: new Date(birthdate),
        role: role,
        specialty: specialty,
      },
      include: { address: true },
    });

    const token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.tipo,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      token,
      user: createdUser,
    });
  } catch (error) {
    console.error('Error registering user:', error);

    return res
      .status(500)
      .json({ message: 'Erro interno ao registrar o usuário.' });
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

    // Retornar os campos esperados no formato correto
    res.json({
      token,
      user: {
        id: user.id,
        name: user.nome,
        email: user.email,
        phone: user.telefone,
        birthdate: user.dataNascimento,
        document: user.documento,
        role: user.tipo,
        address: user.endereco_id,
        admin: user.tipo === 'admin' ? user.id : null,
        doctor: user.tipo === 'medico' ? user.id : null,
        patient: user.tipo === 'paciente' ? user.id : null,
        createdAt: user.created_at, // Certifique-se de que o campo existe no banco
        updatedAt: user.updated_at, // Certifique-se de que o campo existe no banco
      },
    });
  } catch (error) {
    res.status(500).send({ mensagem: 'Erro ao autenticar o usuário' });
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
    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY!
    ) as jwt.JwtPayload;
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

    const codigoRecuperacao = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await enviarEmail(
      email,
      'Recuperação de Senha',
      `Seu código de recuperação é: ${codigoRecuperacao}`
    );

    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ mensagem: `Erro ao enviar e-mail de recuperação: ${error}` });
  }
});

export default router;
