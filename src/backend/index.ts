import { config } from './config/index.js'; // imports project configuration
import Fastify from 'fastify'; // imports backend web framework to create server and listen for requests

// Routes
import { authorRoutes } from './routes/author.routes.js';
import { articleRoutes } from './routes/article.routes.js';

// DB
import { mongoClient }  from './db/mongo_client.js';
import { createMongoIndexes} from './db/mongo_indexes.js'; // imports DB setup function

// Create server using Fastify framework
// logger: true means Fastify will log all incoming requests and responses 
const app = Fastify({ logger: true });

// Start the created server using startup function which conatins all the steps to start the server and listen for requests
const start = async (): Promise<void> => {
  // start of safety net - if any errors inside- will be caught in the catch block
  try {
    // Connect to DB first and then setting up the DB indexes
    await mongoClient.connect();
    await createMongoIndexes();

    // Register the routes with the server
    await app.register(authorRoutes, { prefix: '/authors' });
    await app.register(articleRoutes, { prefix: '/articles' });

    // Listen for incoming requests
    await app.listen({ 
        port: config.port, 
        host: config.host 
    });

  // Print this message if server runs successfully
    app.log.info(`Server running at ${config.backendUrl} in ${config.environment} mode`);
  } catch (error) {
    app.log.error(error); // print the error
    process.exit(1); // exit the process with error code 1
  }
};

 // Run the startup function - this is what actually kicks everything off
start();