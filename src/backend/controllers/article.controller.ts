import type {FastifyRequest, FastifyReply} from 'fastify';
import type {Article, ArticleParams, SearchQuery} from '../types/index.js';

export async function getArticles (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    reply.code(200).send([]);
}

export async function createArticle (
    request: FastifyRequest<{ Body: Omit<Article, 'id'>}>,
    reply: FastifyReply
): Promise<void> {
    const body = request.body;
    reply.code(201).send({
        message:'Article created successfully',
        data: body
});
}

export async function getArticleById (
    request: FastifyRequest<{Params: ArticleParams}>,
    reply: FastifyReply
): Promise<void> {
    const {id} = request.params;
    reply.code(200).send({message: `Get Articles by id ${id}`});
}

export async function updateArticleById (
    request: FastifyRequest<{Params: ArticleParams; Body: Omit<Article, 'id'> }>,
    reply: FastifyReply
): Promise<void> {
    const { id }  = request.params;
    const body = request.body;
    reply.code(200).send({
        message: `Article with ${id} update successfully`,
        data: body
});
}

export async function searchArticles(
    request: FastifyRequest<{Querystring: SearchQuery }>,
    reply: FastifyReply
): Promise<void> {
    const {q} = request.query;
    reply.code(200).send({
        message: `Search Articles with query ${q}`,
        data: []
});
}

