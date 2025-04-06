import express, { Request, Response, Router } from 'express';

const router = express.Router();

let listadoEndpoint: string;
listadoEndpoint = 'teste aqui vou listar os endpoints';


router.get('/', (req: Request, res: Response) => {
  res.send(listadoEndpoint);
});


export default router;