import type{FastifyInstance} from 'fastify';
import {
    createArticle,
    getArticles,
    getArticleById,
    updateArticleById,
    searchArticles
} from '../controllers/article.controller.js';

export async function articleRoutes (
    app: FastifyInstance
): Promise<void>{
    app.get('/search', {}, searchArticles);
    app.get('/', {}, getArticles);
    app.post('/', {}, createArticle);
    app.get('/:id',{}, getArticleById );
    app.put('/:id',{}, updateArticleById);
}
