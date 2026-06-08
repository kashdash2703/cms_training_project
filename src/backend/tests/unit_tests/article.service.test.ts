import { describe, it, expect, beforeEach} from 'vitest';
import { randomUUID } from 'crypto';

import { ArticleService } from '../../services/article.service.js';
import { AuthorService } from '../../services/author.service.js';

import type { AuthorRepository } from '../../repositories/author.repository.js';
import type { ArticleRepository } from '../../repositories/article.repository.js';

import type {
    Article,
    CreateArticleWithExistingAuthorInput,
    UpdateArticleInput,
} from '../../types/index.js';

import { FakeAuthorRepository } from './author.service.test.js';

// Fake Article Repository
export class FakeArticleRepository implements ArticleRepository {
  private articles: Article[] = [];

 // Article repository needs access to author repository
  constructor(private authorRepository: AuthorRepository) {}
  
  async findAll(): Promise<Article[]> {
    return this.articles;
  }

  async findExistingArticle(input: CreateArticleWithExistingAuthorInput): Promise<Article | undefined> {
    return this.articles.find((article) => {
      return (
        article.headline.trim().toLowerCase() ===
          input.headline.trim().toLowerCase() &&
        article.content.trim().toLowerCase() ===
          input.content.trim().toLowerCase() &&
        article.author.id === input.authorId
      );
    });
  }

  async findById(id: string): Promise<Article | undefined> {
    return this.articles.find((article) => article.id === id);
  }

  async search(q: string): Promise<Article[]> {
    const searchText = q.trim().toLowerCase();

    return this.articles.filter((article) => {
      return (
        article.headline.toLowerCase().includes(searchText) ||
        article.content.toLowerCase().includes(searchText)
      );
    });
  }

  async create(input: CreateArticleWithExistingAuthorInput): Promise<Article> {
    const author = await this.authorRepository.findById(input.authorId);

    if (!author) {
      throw new Error('Author not found');
    }

    const newArticle: Article = {
      id: randomUUID(),
      headline: input.headline.trim(),
      content: input.content.trim(),
      author,
    };

    this.articles.push(newArticle);

    return newArticle;
  }

  async findByAuthorId(authorId: string): Promise<Article[]> {
    return this.articles.filter((article) => article.author.id === authorId);
  }

  async updateById(
    id: string,
    input: UpdateArticleInput
  ): Promise<Article | undefined> {
    const article = await this.findById(id);

    if (!article) {
      return undefined;
    }

    if (input.headline !== undefined) {
      article.headline = input.headline.trim();
    }

    if (input.content !== undefined) {
      article.content = input.content.trim();
    }

    return article;
  }

  async deleteById(id: string): Promise<boolean> {
    const initialLength = this.articles.length;

    this.articles = this.articles.filter((article) => article.id !== id);

    return this.articles.length < initialLength;
  }
}

// Test setup
describe('ArticleService', () => {
  let authorRepository: FakeAuthorRepository;
  let articleRepository: FakeArticleRepository;
  let authorService: AuthorService;
  let articleService: ArticleService;

  // Runs before every test
  // This creates a fresh fake database for every test
  beforeEach(() => {
    authorRepository = new FakeAuthorRepository();
    articleRepository = new FakeArticleRepository(authorRepository);

    authorService = new AuthorService(authorRepository);
    articleService = new ArticleService(articleRepository, authorService);
  });

  // T1 
  it('should create an article with existing author', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar27@example.com',
    });

    const result = await articleService.createArticle({
      headline: 'First Article',
      content: 'This is the content of the article',
      authorId: author!.id,
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.article.id).toBeDefined();
      expect(result.article.headline).toBe('First Article');
      expect(result.article.content).toBe('This is the content of the article');
      expect(result.article.author.id).toBe(author!.id);
      expect(result.article.author.email).toBe('kaviya.jeyakumar27@example.com');
    }
  });

  // T2 
  it('should not create an article if existing author is not found', async () => {
    const result = await articleService.createArticle({
      headline: 'First Article',
      content: 'This is the content of the article',
      authorId: 'wrong-author-id',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.reason).toBe('not_found');
    }
  });

  // T3
  it('should create an article with a new author', async () => {
    const result = await articleService.createArticle({
      headline: 'Article With New Author',
      content: 'This article creates a new author also.',
      author: {
        firstName: 'Kaviya',
        lastName: 'Jeyakumar',
        email: 'kaviya.jeyakumar27@example.com',
      },
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.article.headline).toBe('Article With New Author');
      expect(result.article.content).toBe('This article creates a new author also.');
      expect(result.article.author.firstName).toBe('Kaviya');
      expect(result.article.author.lastName).toBe('Jeyakumar');
      expect(result.article.author.email).toBe('kaviya.jeyakumar27@example.com');
    }
  });

  // T4
  it('should not create duplicate article for same author', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar27@example.com',
    });

    await articleService.createArticle({
      headline: 'Duplicate Article',
      content: 'Same article content',
      authorId: author!.id,
    });

    const duplicateResult = await articleService.createArticle({
      headline: 'Duplicate Article',
      content: 'Same article content',
      authorId: author!.id,
    });

    expect(duplicateResult.success).toBe(false);

    if (!duplicateResult.success) {
      expect(duplicateResult.reason).toBe('already_exists');
    }
  });

  // T5
  it('should return all articles', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar27@example.com',
    });

    await articleService.createArticle({
      headline: 'First Article',
      content: 'This is my first article',
      authorId: author!.id,
    });

    await articleService.createArticle({
      headline: 'Second Article',
      content: 'This is my second article',
      authorId: author!.id,
    });

    const articles = await articleService.getArticles();

    expect(articles).toHaveLength(2);
  });

  // T6
  it('should get article by id', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar27@example.com',
    });

    const createResult = await articleService.createArticle({
      headline: 'Find Me',
      content: 'This article should be found by id',
      authorId: author!.id,
    });

    if (!createResult.success) {
      throw new Error('Article creation failed');
    }

    const article = await articleService.getArticleById(createResult.article.id);

    expect(article).toBeDefined();
    expect(article?.headline).toBe('Find Me');
    expect(article?.content).toBe('This article should be found by id');
  });

  // T7
  it('should search articles by keyword', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar27@example.com',
    });

    await articleService.createArticle({
      headline: 'MongoDB Basics',
      content: 'This article explains NoSQL database basics',
      authorId: author!.id,
    });

    await articleService.createArticle({
      headline: 'PostgreSQL Basics',
      content: 'This article explains SQL database basics',
      authorId: author!.id,
    });

    const result = await articleService.searchArticles('mongodb');

    expect(result.totalSearchResults).toBe(1);
    expect(result.results[0]?.article.headline).toBe('MongoDB Basics');
  });

  // T8
  it('should get articles by author id', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar27@example.com',
    });

    await articleService.createArticle({
      headline: 'First Article',
      content: 'This is my first article',
      authorId: author!.id,
    });

    await articleService.createArticle({
      headline: 'Second Article',
      content: 'This is my second article',
      authorId: author!.id,
    });

    const result = await articleService.getArticlesByAuthorId(author!.id);

    expect(result).toBeDefined();
    expect(result?.author.id).toBe(author!.id);
    expect(result?.articles).toHaveLength(2);
  });

  // T9
  it('should update an existing article', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar27@example.com',
    });

    const createResult = await articleService.createArticle({
      headline: 'Old Headline',
      content: 'Old content',
      authorId: author!.id,
    });

    if (!createResult.success) {
      throw new Error('Article creation failed');
    }

    const updateResult = await articleService.updateArticleById(
      createResult.article.id,
      {
        content: 'New content',
      }
    );

    expect(updateResult.success).toBe(true);

    if (updateResult.success) {
      expect(updateResult.article.headline).toBe('Old Headline');
      expect(updateResult.article.content).toBe('New content');
      expect(updateResult.article.author.id).toBe(author!.id);
    }
  });

  // T10
  it('should return not_found when updating unknown article', async () => {
    const result = await articleService.updateArticleById('wrong-article-id', {
      headline: 'New Headline',
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.reason).toBe('not_found');
    }
  });

  // T11
  it('should delete an existing article', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar27@example.com',
    });

    const createResult = await articleService.createArticle({
      headline: 'Article to Delete',
      content: 'This article will be deleted',
      authorId: author!.id,
    });

    if (!createResult.success) {
      throw new Error('Article creation failed');
    }

    const isDeleted = await articleService.deleteArticleById(
      createResult.article.id
    );

    expect(isDeleted).toBe(true);

    const articles = await articleService.getArticles();

    expect(articles).toHaveLength(0);
  });

  // T12
  it('should return false when deleting unknown article', async () => {
    const isDeleted = await articleService.deleteArticleById('wrong-article-id');

    expect(isDeleted).toBe(false);
  });
});


   