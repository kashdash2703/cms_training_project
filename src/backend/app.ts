import Fastify from 'fastify'; // imports backend web framework to create server and listen for requests
import { authorRoutes } from './routes/author.routes.js';
import { articleRoutes } from './routes/article.routes.js';

export async function buildApp() {
  const app = Fastify({ logger: false });

  await app.register(authorRoutes, { prefix: '/authors' });
  await app.register(articleRoutes, { prefix: '/articles' });

  return app;
}