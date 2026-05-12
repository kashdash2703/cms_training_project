import type {FastifyInstance} from 'fastify';
import {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthorById,
    searchAuthors
} from '../controllers/author.controller.js';

export async function authorRoutes (
    app: FastifyInstance
): Promise<void> {
    app.get('/search',{}, searchAuthors);
    app.get('/',{}, getAuthors);
    app.get('/:id',{}, getAuthorById);
    app.post('/', {}, createAuthor);
    app.put('/:id', {}, updateAuthorById);
}