import express, { Request, Response, Router } from 'express';

const router = express.Router();

const endpoints = `
<h1>Endpoints disponíveis</h1>
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