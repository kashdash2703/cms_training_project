// Loads environment variables
import 'dotenv/config'; 
// Imports  PostgreSQL pakage
import pg from 'pg';

// Gets pool from pg package
const { Pool } = pg;

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

if (!dbHost || !dbPort || !dbName || !dbUser || !dbPassword) {
  throw new Error('PostgreSQL environment variables are missing');
}

// creates and exports a new PostgreSQL pool of connections so that reposittories can import and use it
export const sqlClient = new Pool({
  host: dbHost,
  port: Number(dbPort),
  database: dbName,
  user: dbUser,
  password: dbPassword,
});
