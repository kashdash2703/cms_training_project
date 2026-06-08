import { config } from './config/index.js';
import { buildApp } from './app.js';

const start = async (): Promise<void> => {
  try {
    const app = await buildApp();

    await app.listen({
      port: config.port,
      host: config.host,
    });

    console.log(
      `Server running at ${config.backendUrl} in ${config.environment} mode`
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();