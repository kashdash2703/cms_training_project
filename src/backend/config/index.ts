// SETTINGS file for the entire application

// 'dotenv/config' automatically reads .env file
// And loads all variables into 'process.env'
import 'dotenv/config';

export const config = {
    environment: process.env['NODE_ENV'] || 'development',
    port: Number(process.env['BACKEND_PORT'] || 3000),
    host: process.env['BACKEND_HOST'] || '0.0.0.0', //Host tells Fastify which network interface to listen on
    backendUrl: process.env['BACKEND_URL'] || 'https://localhost:3000',
    frontendUrl: process.env['FRONTEND_URL'] || 'https://localhost:5173',
};

