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
    <li><strong>POST</strong> /login</li>
    <li><strong>GET</strong> /protected</li>
    <li><strong>GET</strong> /usuarios</li>
    <li><strong>GET</strong> /usuario/:id</li>
    <li><strong>POST</strong> /usuario</li>
    <li><strong>PUT</strong> /usuario/:id</li>
    <li><strong>DELETE</strong> /usuario/:id</li>
  </ul>
`;

router.get('/', (req: Request, res: Response) => {
  res.send(endpoints);
});


export default router;