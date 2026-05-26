import type {FastifyInstance} from 'fastify';

import {
    getAuthors,
    createAuthor,
    searchAuthors,
    getAuthorById,
    updateAuthorById,
    deleteAuthorById
} from '../controllers/author.controller.js';

export async function authorRoutes (
    app: FastifyInstance
): Promise<void> {
    app.get('/',{}, getAuthors);
    app.post('/', {}, createAuthor);
    app.get('/search', {}, searchAuthors);
    app.get('/:id', {}, getAuthorById);
    app.put('/:id', {}, updateAuthorById);
    app.delete('/:id', {}, deleteAuthorById);
}