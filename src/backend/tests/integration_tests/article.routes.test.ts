import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';

import { buildApp } from '../../app.js';

describe('Article routes integration tests', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  async function createTestAuthor() {
    const uniqueEmail = `author.${randomUUID()}@example.com`;

    const response = await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: 'Kaviya',
        lastName: 'Jeyakumar',
        email: uniqueEmail,
      },
    });

    expect(response.statusCode).toBe(201);

    return response.json();
  }

  async function createTestArticle(authorId: string) {
    const uniqueId = randomUUID();

    const response = await app.inject({
      method: 'POST',
      url: '/articles',
      payload: {
        headline: `Article Headline ${uniqueId}`,
        content: `Article content ${uniqueId}`,
        authorId,
      },
    });

    expect(response.statusCode).toBe(201);

    return response.json();
  }

  it('should create article with existing author using POST /articles', async () => {
    const author = await createTestAuthor();

    const response = await app.inject({
      method: 'POST',
      url: '/articles',
      payload: {
        headline: 'First Article',
        content: 'This is the first article content',
        authorId: author.id,
      },
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();

    expect(body.id).toBeDefined();
    expect(body.headline).toBe('First Article');
    expect(body.content).toBe('This is the first article content');
    expect(body.author.id).toBe(author.id);
    expect(body.author.email).toBe(author.email);
  });

  it('should create article with new author using POST /articles', async () => {
    const uniqueEmail = `new-author.${randomUUID()}@example.com`;

    const response = await app.inject({
      method: 'POST',
      url: '/articles',
      payload: {
        headline: 'Article With New Author',
        content: 'This article also creates a new author',
        author: {
          firstName: 'Jane',
          lastName: 'Smith',
          email: uniqueEmail,
        },
      },
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();

    expect(body.id).toBeDefined();
    expect(body.headline).toBe('Article With New Author');
    expect(body.author.firstName).toBe('Jane');
    expect(body.author.lastName).toBe('Smith');
    expect(body.author.email).toBe(uniqueEmail);
  });

  it('should return 400 when creating article with unknown author id', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/articles',
      payload: {
        headline: 'Invalid Article',
        content: 'This article should not be created',
        authorId: '00000000-0000-0000-0000-000000000000',
      },
    });

    expect(response.statusCode).toBe(400);
  });

  it('should return 409 when creating duplicate article for same author', async () => {
    const author = await createTestAuthor();

    const payload = {
      headline: `Duplicate Article ${randomUUID()}`,
      content: 'Same duplicate content',
      authorId: author.id,
    };

    const firstResponse = await app.inject({
      method: 'POST',
      url: '/articles',
      payload,
    });

    expect(firstResponse.statusCode).toBe(201);

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/articles',
      payload,
    });

    expect(duplicateResponse.statusCode).toBe(409);

    const body = duplicateResponse.json();

    expect(body.message).toBe('Article already exists');
  });

  it('should return all articles using GET /articles', async () => {
    const author = await createTestAuthor();

    const article = await createTestArticle(author.id);

    const response = await app.inject({
      method: 'GET',
      url: '/articles',
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(Array.isArray(body)).toBe(true);

    const matchingArticle = body.find(
      (item: { id: string }) => item.id === article.id
    );

    expect(matchingArticle).toBeDefined();
    expect(matchingArticle.headline).toBe(article.headline);
  });

  it('should get article by id using GET /articles/:id', async () => {
    const author = await createTestAuthor();

    const article = await createTestArticle(author.id);

    const response = await app.inject({
      method: 'GET',
      url: `/articles/${article.id}`,
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.id).toBe(article.id);
    expect(body.headline).toBe(article.headline);
    expect(body.author.id).toBe(author.id);
  });

  it('should return 404 when article id does not exist', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/articles/00000000-0000-0000-0000-000000000000',
    });

    expect(response.statusCode).toBe(404);
  });

  it('should search articles using GET /articles/search?q=', async () => {
    const author = await createTestAuthor();

    const uniqueId = randomUUID();

    const createResponse = await app.inject({
      method: 'POST',
      url: '/articles',
      payload: {
        headline: `MongoDB Search Article ${uniqueId}`,
        content: `This article explains MongoDB integration testing ${uniqueId}`,
        authorId: author.id,
      },
    });

    const article = createResponse.json();

    const response = await app.inject({
      method: 'GET',
      url: `/articles/search?q=${uniqueId}`,
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.totalSearchResults).toBeGreaterThanOrEqual(1);

    const matchingResult = body.results.find(
      (result: { article: { id: string } }) =>
        result.article.id === article.id
    );

    expect(matchingResult).toBeDefined();
  });

  it('should return 400 when article search query is missing', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/articles/search?q=',
    });

    expect(response.statusCode).toBe(400);
  });

  it('should get articles by author id using GET /articles/author/:id', async () => {
    const author = await createTestAuthor();

    const article = await createTestArticle(author.id);

    const response = await app.inject({
      method: 'GET',
      url: `/articles/author/${author.id}`,
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.author.id).toBe(author.id);
    expect(Array.isArray(body.articles)).toBe(true);

    const matchingArticle = body.articles.find(
      (item: { id: string }) => item.id === article.id
    );

    expect(matchingArticle).toBeDefined();
  });

  it('should update article using PUT /articles/:id', async () => {
    const author = await createTestAuthor();

    const article = await createTestArticle(author.id);

    const response = await app.inject({
      method: 'PUT',
      url: `/articles/${article.id}`,
      payload: {
        headline: 'Updated Article Headline',
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.id).toBe(article.id);
    expect(body.headline).toBe('Updated Article Headline');
    expect(body.content).toBe(article.content);
    expect(body.author.id).toBe(author.id);
  });

  it('should return 404 when updating unknown article', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/articles/00000000-0000-0000-0000-000000000000',
      payload: {
        headline: 'Updated Article Headline',
      },
    });

    expect(response.statusCode).toBe(404);
  });

  it('should delete article using DELETE /articles/:id', async () => {
    const author = await createTestAuthor();

    const article = await createTestArticle(author.id);

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/articles/${article.id}`,
    });

    expect(deleteResponse.statusCode).toBe(200);

    const getResponse = await app.inject({
      method: 'GET',
      url: `/articles/${article.id}`,
    });

    expect(getResponse.statusCode).toBe(404);
  });

  it('should return 404 when deleting unknown article', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/articles/00000000-0000-0000-0000-000000000000',
    });

    expect(response.statusCode).toBe(404);
  });
});