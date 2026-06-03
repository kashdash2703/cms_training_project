import { randomUUID } from 'crypto';
import type {
  Author,
  CreateAuthorInput,
  UpdateAuthorInput,
} from '../../types/index.js';

import type { AuthorRepository } from '../author.repository.js';
import { mongoDb } from '../../db/mongo_client.js';

type AuthorDocument = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

function mapAuthorDocumentToAuthor(document: AuthorDocument): Author {
  return {
    id: document._id,
    firstName: document.firstName,
    lastName: document.lastName,
    email: document.email,
  };
}

export class MongoAuthorRepository implements AuthorRepository {
  private collection = mongoDb.collection<AuthorDocument>('authors');

  async findAll(): Promise<Author[]> {
    const documents = await this.collection
      .find()
      .sort({ firstName: 1 })
      .toArray();

    return documents.map(mapAuthorDocumentToAuthor);
  }

  async findByEmail(email: string): Promise<Author | undefined> {
    const document = await this.collection.findOne({
      email: {
        $regex: `^${email.trim()}$`,
        $options: 'i',
      },
    });

    if (!document) {
      return undefined;
    }

    return mapAuthorDocumentToAuthor(document);
  }

  async findById(id: string): Promise<Author | undefined> {
    const document = await this.collection.findOne({
      _id: id,
    });

    if (!document) {
      return undefined;
    }

    return mapAuthorDocumentToAuthor(document);
  }

  async search(q: string): Promise<Author[]> {
    const searchText = q.trim();

    const documents = await this.collection
      .find({
        $or: [
          { firstName: { $regex: searchText, $options: 'i' } },
          { lastName: { $regex: searchText, $options: 'i' } },
          { email: { $regex: searchText, $options: 'i' } },
        ],
      })
      .sort({ firstName: 1 })
      .toArray();

    return documents.map(mapAuthorDocumentToAuthor);
  }

  async create(input: CreateAuthorInput): Promise<Author> {
    const newDocument: AuthorDocument = {
      _id: randomUUID(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
    };

    await this.collection.insertOne(newDocument);

    return mapAuthorDocumentToAuthor(newDocument);
  }

  async updateById(
    id: string,
    input: UpdateAuthorInput
  ): Promise<Author | undefined> {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...(input.firstName !== undefined && {
            firstName: input.firstName.trim(),
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
        returnDocument: 'after',
      }
    );

    if (!result) {
      return undefined;
    }

    return mapAuthorDocumentToAuthor(result);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({
      _id: id,
    });

    return result.deletedCount > 0;
  }
}