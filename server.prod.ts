import fs from 'node:fs/promises';
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter, createTrpcContext } from './src/api/router';
import { env } from './src/env';

const url = new URL(env.VITE_APP_URL);
const port = url.port || 3000;
const base = '/';

const app = express();

app.use(
  base,
  express.static('dist/client', {
    index: false, // We’ll handle rendering index.html below
  }),
);

const template = await fs.readFile('./dist/client/index.html', 'utf-8');

const ssrModule = await import('./dist/server/server.mjs');
const render = ssrModule.render;

app.use(
  '/api',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: createTrpcContext,
  }),
);

app.use('*', async (req, res) => {
  try {
    const rendered = await render(req, res);

    const html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${rendered}</div>`,
    );

    res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    console.error(e);
    res.status(500).end('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
