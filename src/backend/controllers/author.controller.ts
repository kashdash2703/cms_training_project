import type { FastifyRequest, FastifyReply } from 'fastify';
import type { CreateAuthorInput, UpdateAuthorInput } from '../services/author.service.js';
import type { AuthorParams, SearchQuery } from '../types/index.js';
import { AuthorService } from '../services/author.service.js';

const authorService = new AuthorService();

export async function getAuthors(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const authors = authorService.getAllAuthors();

    reply.code(200).send(authors);
}

export async function createAuthor(
  request: FastifyRequest<{ Body: CreateAuthorInput }>,
  reply: FastifyReply
): Promise<void> {
  const body = request.body;
  
  const author = authorService.createAuthor(body);
  reply.code(201).send({ 
    message: 'Author created',
    data: author 
  });
}

export async function getAuthorById(
    request: FastifyRequest<{ Params: AuthorParams }>,
    reply: FastifyReply
): Promise<void> {
    const { id } = request.params;
    const author = authorService.getAuthorById(id);
    if (!author) {
        reply.code(404).send({
            message: `Author with id ${id} not found`,
        });
        return;
    }

    reply.code(200).send(author);
}

export async function updateAuthorById(
    request: FastifyRequest<{ Params: AuthorParams; Body: UpdateAuthorInput }>,
    reply: FastifyReply
): Promise<void> {
    const { id } = request.params;
    const body = request.body;

    const updatedAuthor = authorService.updateAuthorById(id,body);

    if (!updatedAuthor) { 
        reply.code(404).send({
            message: `Author with id ${id} not found`,
        });
        return;
    }
    reply.code(200).send({
        message: `Author with id ${id} updated`,
        data: updatedAuthor,
    });
}

export async function searchAuthors(
    request: FastifyRequest<{ Querystring: SearchQuery }>,
    reply: FastifyReply
): Promise<void> {
    const { q } = request.query;

    const authors = authorService.searchAuthors(q);

    reply.code(200).send({message: `Search authors with query ${q}`,
        data: authors,
    });
}


