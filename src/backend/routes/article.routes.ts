import type { FastifyInstance } from 'fastify'; 
import {
  getArticles,
  createArticle,
  searchArticles,
  updateArticleById,
  deleteArticleById
} from '../controllers/author.controller.js';

//Async function that registers all the routes related to articles 
export async function articleRoutes (app: FastifyInstance): Promise<void> {

  // 1. GET /articles - Get all articles
  app.get('/articles', getArticles);

  // 2. POST /articles - Create a new article
  app.post('/articles', createArticle);

  // 3. GET /articles/search - Search articles by keyword
  // NOTE: /articles/search must be registered BEFORE /articles/:id
  // Otherwise fastify will treat 'search' as an id
  app.get('/articles/search', searchArticles);

  // 4. PUT /articles/:id - Update an existing article
  app.put('/articles/:id', updateArticleById);

  // 5. DELETE /articles/:id - Delete an article
  app.delete('/articles/:id', deleteArticleById);

}
                                  