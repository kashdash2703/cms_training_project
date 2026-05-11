import Fastify from 'fastify';
import { authorRoutes } from './routes/author.routes.js';
import { articleRoutes } from './routes/article.routes.js';

const app = Fastify({ logger: true });

const start = async (): Promise<void> => {
  try {
    await app.register(authorRoutes, { prefix: '/authors' });
    await app.register(articleRoutes, { prefix: '/articles' });
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Server running at http://localhost:3000');
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();