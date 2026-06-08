import 'dotenv/config';
// Imports  Mongoclient class from Mongodb pakage
import { MongoClient } from 'mongodb';

const mongoHost = process.env.MONGO_HOST;
const mongoPort = process.env.MONGO_PORT;
const mongoDbName = process.env.MONGO_DB_NAME;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;

if (!mongoHost || !mongoPort || !mongoDbName || !mongoUser || !mongoPassword) {
  throw new Error('MongoDB environment variables are missing');
}

// MongoDB connection URI
const mongoUri = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}?authSource=admin`;

export const mongoClient = new MongoClient(mongoUri);

export const mongoDb = mongoClient.db(mongoDbName);