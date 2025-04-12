import express, { Request, Response, Router } from 'express';

const router = express.Router();

const endpoints = `
  <h1>Backend do Postinho de Saúde vs2teste-alteraçao commit</h1>
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
    <li><strong>POST</strong> /login<br>(Autenticação de usuário. Parâmetros: username, password. Retorno: token de autenticação ou erro de credenciais inválidas.)</li>
    <li><strong>GET</strong> /protected<br>(Acesso a área protegida. Parâmetros: token de autenticação no cabeçalho Authorization. Retorno: mensagem de boas-vindas ou erro de token inválido.)</li>
    <li><strong>GET</strong> /usuarios<br>(Lista de usuários. Parâmetros: nenhum. Retorno: lista de usuários ou erro de leitura da tabela.)</li>
    <li><strong>GET</strong> /usuario/:id<br>(Detalhes de um usuário. Parâmetros: id do usuário. Retorno: detalhes do usuário ou erro de leitura da tabela.)</li>
    <li><strong>POST</strong> /usuario<br>(Criação de um novo usuário. Parâmetros: nome, email. Retorno: usuário criado ou erro de inserção.)</li>
    <li><strong>PUT</strong> /usuario/:id<br>(Atualização de um usuário. Parâmetros: id do usuário, nome, email. Retorno: usuário atualizado ou erro de atualização.)</li>
    <li><strong>DELETE</strong> /usuario/:id<br>(Exclusão de um usuário. Parâmetros: id do usuário. Retorno: mensagem de exclusão ou erro de exclusão.)</li>
  </ul>
`;

router.get('/', (req: Request, res: Response) => {
  res.send(endpoints);
});


export default router;