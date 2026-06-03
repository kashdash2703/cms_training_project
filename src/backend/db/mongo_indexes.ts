// indexes are created on collections inside the db (i.e., authors and articles)
// Indexes are nothing but the rules that we want to apply on the data in the collection.

import { mongoDb } from './mongo_client.js';

// Mongodb Indexes for authors and articles collections

// imported in the main startup file (index.ts)
export async function createMongoIndexes(): Promise<void> {
  await mongoDb.collection('authors').createIndex(
    { email: 1 }, //  1 for ascending order
    {
      unique: true,
      collation: { // Collation means how string comparison should be done
        locale: 'en', // English comparison rules
        strength: 2, // case-sensitive comparison
      },
    }
  );

  await mongoDb.collection('articles').createIndex(
    {
      headline: 1,
      content: 1,
      'author.id': 1,
    },
    {
      unique: true,
      collation: {
        locale: 'en', 
        strength: 2,
      },
    }
  );
}
