import type { FastifyRequest, FastifyReply } from 'fastify';
import type { 
    CreateArticleInput,
    CreateArticleWithExistingAuthorInput,
    UpdateArticleInput,
    ArticleParams,
    SearchQuery,
 } from '../types/index.js';
import { ArticleService } from '../services/article.service.js';
import { AuthorService } from '../services/author.service.js';

const authorService = new AuthorService();
const articleService = new ArticleService(authorService);

//  Helper functions
// a. hasExistingAuthorId - checks whether there's an existing author
function hasExistingAuthorId(
  body: CreateArticleInput | CreateArticleWithExistingAuthorInput
): body is CreateArticleWithExistingAuthorInput {
  return 'authorId' in body;
}

// b. isValidCreateArticleInput - Validate create article input
function isValidCreateArticleInput(
  body: CreateArticleInput | CreateArticleWithExistingAuthorInput
): boolean {
  const hasValidHeadline =
    typeof body.headline === 'string' && body.headline.trim() !== '';

  const hasValidContent =
    typeof body.content === 'string' && body.content.trim() !== '';

  if (!hasValidHeadline || !hasValidContent) {
    return false;
  }

  if (hasExistingAuthorId(body)) {
    return typeof body.authorId === 'string' && body.authorId.trim() !== '';
  }

  return (
    body.author !== undefined &&
    typeof body.author.firstName === 'string' &&
    body.author.firstName.trim() !== '' &&
    typeof body.author.lastName === 'string' &&
    body.author.lastName.trim() !== '' &&
    typeof body.author.email === 'string' &&
    body.author.email.trim() !== ''
  );
}

// c. isValidUpdateArticleInput -  Validate update article input
function isValidUpdateArticleInput(body: UpdateArticleInput): boolean {
  return body.headline !== undefined || body.content !== undefined;
}

// Main functions
// 1. GET /articles - Get a list of all articles
export async function getArticles (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const articles = articleService.getArticles();

    if (articles.length === 0) {
    return reply.code(404).send({ message: 'No articles found' });
    }

    return reply.code(200).send(articles);
}


// 2. POST /articles - Create a new article
export async function createArticle (
    request: FastifyRequest<{ Body: CreateArticleInput | CreateArticleWithExistingAuthorInput }>,
    reply: FastifyReply
): Promise<void> {

    const body = request.body;

    if (!isValidCreateArticleInput(body)) {
        return reply.code(400).send({ message: 'Invalid input' });
    }

    const result = articleService.createArticle(body);

    if (result.success) {
        return reply.code(201).send(result.article);
    }

    if (result.reason === 'already_exists') {
        return reply.code(409).send({ message: 'Article already exists' });
    }

    return reply.code(400).send({ message: 'Invalid input' });
}

// 3. GET /articles/search - Search for articles based on query
export async function searchArticles (
    request: FastifyRequest<{ Querystring: SearchQuery }>,
    reply: FastifyReply
): Promise<void> {
    const { q } = request.query;


    if (!q || q.trim() === '') {
        return reply.code(400).send({ message: 'Invalid search query' });
    }

    const searchResult = articleService.searchArticles(q);

    if (searchResult.totalSearchResults === 0) {
        return reply.code(404).send({ message: 'No articles found' });
    }

    return reply.code(200).send(searchResult);
}

// 4. PUT /articles/:id - Update an existing article by it's ID
export async function updateArticleById (
    request: FastifyRequest<{ Params: ArticleParams; Body: UpdateArticleInput }>,
    reply: FastifyReply
): Promise<void> {
    const { id }  = request.params;
    const body = request.body;

    if (!isValidUpdateArticleInput(body)) {
        return reply.code(400).send({ message: 'Invalid input' });
    }

    const result = articleService.updateArticleById(id, body);

    if (!result.success && result.reason === 'not_found') {
        return reply.code(404).send({ message: 'Article not found' });
    }

    if (result.success) {
        return reply.code(200).send(result.article);
    }
}

// 5. DELETE /articles/:id - Delete an article 
export async function deleteArticleById(
    request: FastifyRequest<{ Params: ArticleParams }>,
    reply: FastifyReply
): Promise<void> {
    const { id } = request.params;
    const isDeleted = articleService.deleteArticleById(id);

    if (!isDeleted) {
        return reply.code(404).send({ message: 'Article not found' });
    }

    return reply.code(200).send({
        message: 'Article deleted successfully',
    });
}

