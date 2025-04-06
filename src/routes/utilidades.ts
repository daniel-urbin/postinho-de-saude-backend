import express, { Request, Response, Router } from 'express';

interface Layer {
  route: {
    path: string;
    stack: { method: string }[];
  };
}

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
  const routes = (router as any).stack.filter((layer: Layer) => layer.route);

  res.send(`
    <h1>Endpoints disponíveis</h1>
    <ul>
      ${routes.map((layer: Layer) => `<li><strong>${layer.route.stack[0].method}</strong> ${layer.route.path}</li>`).join('')}
    </ul>
  `);
});

export default router;