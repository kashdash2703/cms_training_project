import type{FastifyInstance} from 'fastify'; //FastifyInstance is a type that describes what the Fastify app objects look like)

//Importing all functions from the article controller
import {
    getArticles,
    createArticle,
    searchArticles,
    getArticlesByAuthorId,
    getArticleById,
    updateArticleById,
    deleteArticleById
} from '../controllers/article.controller.js';

//Async function that registers all the routes related to articles 
export async function articleRoutes (
    app: FastifyInstance
): Promise<void>{
    app.get('/', {}, getArticles);
    app.post('/', {}, createArticle);
    app.get('/search', {}, searchArticles);
    app.get('/author/:id', {}, getArticlesByAuthorId);
    app.get('/:id', {}, getArticleById);
    app.put('/:id',{}, updateArticleById);
    app.delete('/:id',{}, deleteArticleById );
}
                                  