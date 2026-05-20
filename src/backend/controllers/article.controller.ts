import type {FastifyRequest, FastifyReply} from 'fastify';
import type {CreateArticleInput, UpdateArticleInput} from '../services/article.service.js';
import type {ArticleParams, SearchQuery} from '../types/index.js';
import {ArticleService} from '../services/article.service.js';

const articleService = new ArticleService();

export async function getArticles (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const articles = articleService.getAllArticles();
    reply.code(200).send(articles);
}

export async function createArticle (
    request: FastifyRequest<{ Body: CreateArticleInput}>,
    reply: FastifyReply
): Promise<void> {
    const body = request.body;
    const article = articleService.createArticle(body);
    
    reply.code(201).send({
        message:'Article created successfully',
        data: article
});
}

export async function getArticleById (
    request: FastifyRequest<{Params: ArticleParams}>,
    reply: FastifyReply
): Promise<void> {
    const {id} = request.params;
    const article = articleService.getArticleById(id);

    if (!article) {
        reply.code(404).send({
            message: `Àrticle with id {id} not found`,
        });
        return;
    }
    reply.code(200).send({article});
}

export async function updateArticleById (
    request: FastifyRequest<{Params: ArticleParams; Body: UpdateArticleInput }>,
    reply: FastifyReply
): Promise<void> {
    const { id }  = request.params;
    const body = request.body;

    const updatedArticle = articleService.updateArticleById(id,body);

    if (!updatedArticle) {
        reply.code(404).send({
            message: `Article with id ${id} not found`,
        });
        return;
    }
    reply.code(200).send({
        message: `Article with ${id} update successfully`,
        data: updatedArticle
});
}

export async function searchArticles(
    request: FastifyRequest<{Querystring: SearchQuery }>,
    reply: FastifyReply
): Promise<void> {
    const {q} = request.query;

    const articles = articleService.searchArticles (q);
    reply.code(200).send({
        message: `Search Articles with query ${q}`,
        data: articles
});
}

