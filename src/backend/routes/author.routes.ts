import type { FastifyInstance } from 'fastify'; //FastifyInstance is a type that describes what the Fastify app objects look like)

//Importing all functions from the article controller
import {
    getAuthors,
    createAuthor,
    searchAuthor,
    getAuthorById,
    updateAuthorById,
    deleteAuthorById
} from '../controllers/author.controller.js';

//Async function that registers all the routes related to articles 
export async function authorRoutes (app: FastifyInstance): Promise<void> {

// 1. GET /authors - Get all authors
  app.get('/authors', getAuthors);

  // 2. POST /authors - Create a new author
  app.post('/authors', createAuthor);

  // 3. GET /authors/search - Search authors by keyword
  // NOTE: /authors/search must be registered BEFORE /authors/:id
  // Otherwise fastify will treat 'search' as an id
  app.get('/authors/search', searchAuthor);

  // 4. GET /authors/:id - Get specific author and their articles
  app.get('/authors/:id', getAuthorById);

  // 5. PUT /authors/:id - Update an existing author
  app.put('/authors/:id', updateAuthorById);

  // 6. DELETE /authors/:id - Delete an existing author
  app.delete('/authors/:id', deleteAuthorById);

}
                                  