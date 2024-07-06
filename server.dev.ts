import fs from 'node:fs/promises';
import express from 'express';
import { createServer } from 'vite';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createTrpcContext } from './src/api/router';
import { env } from './src/env';

const url = new URL(env.VITE_APP_URL);
const port = url.port || 3000;
const base = '/';

const app = express();

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  base,
});

app.use(vite.middlewares);

app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTrpcContext,
  }),
);

app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    const render = (await vite.ssrLoadModule('src/entry/server.tsx')).render;
    let template = await fs.readFile('./index.html', 'utf-8');
    template = await vite.transformIndexHtml(url, template);

    const rendered = await render(req, res);
    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${rendered}</div>`,
    );

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  console.log(`Server started at ${url}`);
});
