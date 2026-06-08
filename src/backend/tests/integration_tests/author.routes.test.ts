import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';

import { buildApp } from '../../app.js';

// describe - All author resource integration tests together
// describe (Test_group_name, function)
describe('Author routes integration tests', () => {
  let app: FastifyInstance;

  // Purpose:
  // Start with a fresh app before each test.
  beforeEach(async () => {
    app = await buildApp();
    await app.ready();
  });

  // Purpose:
  // Close the app cleanly after each test.
  afterEach(async () => {
    await app.close();
  });

  // T1 - Create new author and return status code 201
  it('should create an author using POST /authors', async () => {
    const uniqueEmail = `kaviya.${randomUUID()}@example.com`;

    // app.inject() sends a fake HTTP request to the Fastify app
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

    // response.json() converts the API response body into a JavaScript object.
    const body = response.json();

    expect(body.id).toBeDefined();
    expect(body.firstName).toBe('Kaviya');
    expect(body.lastName).toBe('Jeyakumar');
    expect(body.email).toBe(uniqueEmail);
  });

  // T2 - Check duplicate author creation

  it('should return 409 when creating duplicate author with same email', async () => {
    const uniqueEmail = `kaviya.${randomUUID()}@example.com`;

    // First request creates the author
    await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: 'Kaviya',
        lastName: 'Jeyakumar',
        email: uniqueEmail,
      },
    });

    // Second request tries to create another author with the same email
    const duplicateResponse = await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: 'Kaviya Shri',
        lastName: 'Jeyakumar',
        email: uniqueEmail,
      },
    });

    expect(duplicateResponse.statusCode).toBe(409);

    const body = duplicateResponse.json();

    expect(body.message).toBe('Author already exists');
  });

  // T3 - Checks GET /authors.
  it('should return all authors using GET /authors', async () => {
    const uniqueEmail = `kaviya.${randomUUID()}@example.com`;

    // First create one author.
    const createResponse = await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: 'Kaviya',
        lastName: 'Jeyakumar',
        email: uniqueEmail,
      },
    });
    // Store the created author response.
    const createdAuthor = createResponse.json();

    // Now, get all authors
    const response = await app.inject({
      method: 'GET',
      url: '/authors',
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    // GET /authors should return an array
    expect(Array.isArray(body)).toBe(true);

    // body.find() searches inside the returned authors list.
    const matchingAuthor = body.find(
      (author: { id: string }) => author.id === createdAuthor.id
    );

    expect(matchingAuthor).toBeDefined();
    expect(matchingAuthor.email).toBe(uniqueEmail);
  });

  // T4 - Checks GET /authors/:id
  it('should get author by id using GET /authors/:id', async () => {
    const uniqueEmail = `kaviya.${randomUUID()}@example.com`;

    const createResponse = await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: 'Kaviya',
        lastName: 'Jeyakumar',
        email: uniqueEmail,
      },
    });

    const createdAuthor = createResponse.json();

    const response = await app.inject({
      method: 'GET',
      url: `/authors/${createdAuthor.id}`,
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.id).toBe(createdAuthor.id);
    expect(body.email).toBe(uniqueEmail);
  });

  // T5 - Checks GET /authors/:id for a wrong ID.
  it('should return 404 when author id does not exist', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/authors/00000000-0000-0000-0000-000000000000', // UUID doesn't exists in the database
    });

    expect(response.statusCode).toBe(404);
  });

  // T6 - Checks GET /authors/search?q=...
  it('should search authors using GET /authors/search?q=', async () => {
    const uniqueId = randomUUID();
    const uniqueEmail = `kaviya.${uniqueId}@example.com`;

    await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: 'Kaviya',
        lastName: 'Jeyakumar',
        email: uniqueEmail,
      },
    });

    const response = await app.inject({
      method: 'GET',
      url: `/authors/search?q=${uniqueEmail}`,
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    // Search response schema:
    // {
    //   totalSearchResults: number,
    //   results: [
    //     {
    //       author: {
    //         id,
    //         firstName,
    //         lastName,
    //         email
    //       }
    //     }
    //   ]
    // }

    expect(body.totalSearchResults).toBeGreaterThanOrEqual(1);

    // Find the exact author inside the search results
    const matchingResult = body.results.find(
      (result: { author: { email: string } }) =>
        result.author.email === uniqueEmail
    );

    expect(matchingResult).toBeDefined();
  });

  // T7 -  Checks missing search query
  it('should return 400 when search query is missing', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/authors/search?q=',
    });

    expect(response.statusCode).toBe(400);
  });

  // T8 - Checks PUT /authors/:id
  it('should update author using PUT /authors/:id', async () => {
    const uniqueEmail = `john.${randomUUID()}@example.com`;

    const createResponse = await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: 'Kaviya',
        lastName: 'Jeyakumar',
        email: uniqueEmail,
      },
    });

    const createdAuthor = createResponse.json();

    const response = await app.inject({
      method: 'PUT',
      url: `/authors/${createdAuthor.id}`,
      payload: {
        firstName: 'Kaviya Shri',
      },
    });

    expect(response.statusCode).toBe(200);

    const body = response.json();

    expect(body.id).toBe(createdAuthor.id);
    expect(body.firstName).toBe('Kaviya Shri');
    expect(body.lastName).toBe('Jeyakumar');
    expect(body.email).toBe(uniqueEmail);
  });

  // T9 - Checks DELETE /authors/:id
  it('should delete author using DELETE /authors/:id', async () => {
    const uniqueEmail = `kaviya.${randomUUID()}@example.com`;

    const createResponse = await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: '  Kaviya',
        lastName: 'Jeyakumar',
        email: uniqueEmail,
      },
    });

    const createdAuthor = createResponse.json();

    const deleteResponse = await app.inject({
      method: 'DELETE',
      url: `/authors/${createdAuthor.id}`,
    });

    expect(deleteResponse.statusCode).toBe(200);

    const getResponse = await app.inject({
      method: 'GET',
      url: `/authors/${createdAuthor.id}`,
    });

    expect(getResponse.statusCode).toBe(404);
  });

  // T10 - Checks invalid POST /authors request
  it('should return 400 when required fields are missing', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/authors',
      payload: {
        firstName: 'Kaviya',
      },
    });

    expect(response.statusCode).toBe(400);
  });
});