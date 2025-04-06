import express, { Request, Response, Router } from 'express';

const router = express.Router();

const endpoints = `
  <h1>Backend do Postinho de Saúde</h1>
  <p>
    Software para agendamento de consulta no "Postinho de Saúde" do SUS,
    desenvolvido por estudantes do Curso de Análise e Desenvolvimento de Sistemas
    do Centro Universitário Uniftec.
  </p>
  <p>
    Este backend fornece uma API REST para gerenciamento de serviços de saúde,
    incluindo agendamento de consultas, gerenciamento de usuários e outras
    funcionalidades.
  </p>
  <h2>Endpoints disponíveis</h2>
  <ul>
    <li>
      <strong>POST</strong> /login
      <p>Autenticação de usuário. Parâmetros: username, password. Retorno: token de autenticação ou erro de credenciais inválidas.</p>
    </li>
    <li>
      <strong>GET</strong> /protected
      <p>Acesso a área protegida. Parâmetros: token de autenticação no cabeçalho Authorization. Retorno: mensagem de boas-vindas ou erro de token inválido.</p>
    </li>
    <li>
      <strong>GET</strong> /usuarios
      <p>Lista de usuários. Parâmetros: nenhum. Retorno: lista de usuários ou erro de leitura da tabela.</p>
    </li>
    <li>
      <strong>GET</strong> /usuario/:id
      <p>Detalhes de um usuário. Parâmetros: id do usuário. Retorno: detalhes do usuário ou erro de leitura da tabela.</p>
    </li>
    <li>
      <strong>POST</strong> /usuario
      <p>Criação de um novo usuário. Parâmetros: nome, email. Retorno: usuário criado ou erro de inserção.</p>
    </li>
    <li>
      <strong>PUT</strong> /usuario/:id
      <p>Atualização de um usuário. Parâmetros: id do usuário, nome, email. Retorno: usuário atualizado ou erro de atualização.</p>
    </li>
    <li>
      <strong>DELETE</strong> /usuario/:id
      <p>Exclusão de um usuário. Parâmetros: id do usuário. Retorno: mensagem de exclusão ou erro de exclusão.</p>
    </li>
  </ul>
`;


router.get('/', (req: Request, res: Response) => {
  res.send(endpoints);
});


export default router;