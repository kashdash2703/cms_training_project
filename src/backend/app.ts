import { config } from './config/index.js';
import Fastify from 'fastify';
import { authorRoutes } from './routes/author.routes.js';
import { articleRoutes } from './routes/article.routes.js';


const app = Fastify({ logger: true });

const start = async (): Promise<void> => {
  try {
    await app.register(authorRoutes, { prefix: '/authors' });
    await app.register(articleRoutes, { prefix: '/articles' });
    await app.listen({ 
        port: config.port, 
        host: config.host 
    });
    console.log(`Server running at ${config.backendUrl} in ${config.environment} mode`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();