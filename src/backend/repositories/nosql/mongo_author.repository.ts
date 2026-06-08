import { randomUUID } from 'crypto';
import type {
  Author,
  CreateAuthorInput,
  UpdateAuthorInput,
} from '../../types/index.js';

import type { AuthorRepository } from '../author.repository.js';
import { mongoDb } from '../../db/mongo_client.js';

type AuthorDocument = {
  _id: string; // _id and not id beacuse MongoDB uses _id as the default primary key field
  firstName: string;
  lastName: string;
  email: string;
};

// Converter function which converts MongoDB format to API/service format
function mapAuthorDocumentToAuthor(document: AuthorDocument): Author {
  return {
    id: document._id,
    firstName: document.firstName,
    lastName: document.lastName,
    email: document.email,
  };
}

export class MongoAuthorRepository implements AuthorRepository {
  // Authors will be stored in the 'authors' collection in MongoDB
  private collection = mongoDb.collection<AuthorDocument>('authors');

  // 1. Get all authors, sorted by first name
  async findAll(): Promise<Author[]> {
    const documents = await this.collection
      .find() // get all documents
      .sort({ firstName: 1 }) // sort by firstName in ascending order
      .toArray(); // converts cursor to Array

    return documents.map(mapAuthorDocumentToAuthor);  // converts each MongoDB document to Author format
  }

  // 2. Find author by email 
  async findByEmail(email: string): Promise<Author | undefined> {
    const document = await this.collection.findOne({ // exact single match for email
      email: {
        $regex: `^${email.trim()}$`, // ^ = start, $ = end (exact match)
        $options: 'i', // i = case-sensitive
      },
    });

    if (!document) {
      return undefined; 
    }

    return mapAuthorDocumentToAuthor(document);
  }

  // 3. Find author by id
  async findById(id: string): Promise<Author | undefined> {
    const document = await this.collection.findOne({
      _id: id, // search by _id field in MongoDB
    });

    if (!document) {
      return undefined;
    }

    return mapAuthorDocumentToAuthor(document);
  }

  // 4. Search authors by first name, last name or email (partial match)
  async search(q: string): Promise<Author[]> {
    const searchText = q.trim();

    const documents = await this.collection
      .find({
        $or: [ // $or = match ANY of these conditions
          { firstName: { $regex: searchText, $options: 'i' } },
          { lastName: { $regex: searchText, $options: 'i' } },
          { email: { $regex: searchText, $options: 'i' } },
        ],
      })
      .sort({ firstName: 1 })
      .toArray();

    return documents.map(mapAuthorDocumentToAuthor);
  }

  // 5. Create a new author
  async create(input: CreateAuthorInput): Promise<Author> {
    const newDocument: AuthorDocument = {
      _id: randomUUID(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
    };

    await this.collection.insertOne(newDocument); // save to DB

    return mapAuthorDocumentToAuthor(newDocument); // Returns the created author in API format
  }

  // 6. Update an existing author by ID
  async updateById(id: string, input: UpdateAuthorInput): Promise<Author | undefined> {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      {
        $set: { // $set = only update the fields provided in input
          ...(input.firstName !== undefined && {
            firstName: input.firstName.trim(),  // only if provided
          }),
          ...(input.lastName !== undefined && {
            lastName: input.lastName.trim(),
          }),
          ...(input.email !== undefined && {
            email: input.email.trim(),
          }),
        },
      },
      {
        returnDocument: 'after', // return UPDATED document not old one
      }
    );

    if (!result) {
      return undefined;
    }

    return mapAuthorDocumentToAuthor(result);
  }

  // 7. Delete an author by ID
  async deleteById(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({
      _id: id,
    });

    return result.deletedCount > 0;
  }
}