import { randomUUID } from 'crypto';

import type {
  Article,
  Author,
  CreateArticleWithExistingAuthorInput,
  UpdateArticleInput,
} from '../../types/index.js';

import type { ArticleRepository } from '../article.repository.js';
import { mongoDb } from '../../db/mongo_client.js';

type AuthorDocument = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type ArticleDocument = {
  _id: string;
  headline: string;
  content: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

function mapArticleDocumentToArticle(document: ArticleDocument): Article {
  return {
    id: document._id,
    headline: document.headline,
    content: document.content,
    author: document.author,
  };
}

function mapAuthorDocumentToAuthor(document: AuthorDocument): Author {
  return {
    id: document._id,
    firstName: document.firstName,
    lastName: document.lastName,
    email: document.email,
  };
}

export class MongoArticleRepository implements ArticleRepository {
  private articleCollection = mongoDb.collection<ArticleDocument>('articles');
  private authorCollection = mongoDb.collection<AuthorDocument>('authors');

  async findAll(): Promise<Article[]> {
    const documents = await this.articleCollection
      .find()
      .sort({ headline: 1 })
      .toArray();

    return documents.map(mapArticleDocumentToArticle);
  }

  async findById(id: string): Promise<Article | undefined> {
    const document = await this.articleCollection.findOne({
      _id: id,
    });

    if (!document) {
      return undefined;
    }

    return mapArticleDocumentToArticle(document);
  }

  async findByAuthorId(authorId: string): Promise<Article[]> {
    const documents = await this.articleCollection
      .find({
        'author.id': authorId,
      })
      .sort({ headline: 1 })
      .toArray();

    return documents.map(mapArticleDocumentToArticle);
  }

  async findExistingArticle(
    input: CreateArticleWithExistingAuthorInput
  ): Promise<Article | undefined> {
    const document = await this.articleCollection.findOne({
      headline: {
        $regex: `^${input.headline.trim()}$`,
        $options: 'i',
      },
      content: {
        $regex: `^${input.content.trim()}$`,
        $options: 'i',
      },
      'author.id': input.authorId,
    });

    if (!document) {
      return undefined;
    }

    return mapArticleDocumentToArticle(document);
  }

  async search(q: string): Promise<Article[]> {
    const searchText = q.trim();

    const documents = await this.articleCollection
      .find({
        $or: [
          { headline: { $regex: searchText, $options: 'i' } },
          { content: { $regex: searchText, $options: 'i' } },
        ],
      })
      .sort({ headline: 1 })
      .toArray();

    return documents.map(mapArticleDocumentToArticle);
  }

  async create(input: CreateArticleWithExistingAuthorInput): Promise<Article> {
    const authorDocument = await this.authorCollection.findOne({
      _id: input.authorId,
    });

    if (!authorDocument) {
      throw new Error('Author not found');
    }

    const author = mapAuthorDocumentToAuthor(authorDocument);

    const newDocument: ArticleDocument = {
      _id: randomUUID(),
      headline: input.headline.trim(),
      content: input.content.trim(),
      author,
    };

    await this.articleCollection.insertOne(newDocument);

    return mapArticleDocumentToArticle(newDocument);
  }

  async updateById(
    id: string,
    input: UpdateArticleInput
  ): Promise<Article | undefined> {
    const result = await this.articleCollection.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...(input.headline !== undefined && {
            headline: input.headline.trim(),
          }),
          ...(input.content !== undefined && {
            content: input.content.trim(),
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

    return mapArticleDocumentToArticle(result);
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.articleCollection.deleteOne({
      _id: id,
    });

    return result.deletedCount > 0;
  }
}