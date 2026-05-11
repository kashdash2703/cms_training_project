import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Author, AuthorParams, SearchQuery } from '../types/index.js';

export async function getAuthors(
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    reply.code(200).send([]);
}

export async function createAuthor(
  request: FastifyRequest<{ Body: Omit<Author, 'id'> }>,
  reply: FastifyReply
): Promise<void> {
  const body = request.body;
  reply.code(201).send({ 
    message: 'Author created',
    data: body 
  });
}

export async function getAuthorById(
    request: FastifyRequest<{ Params: AuthorParams }>,
    reply: FastifyReply
): Promise<void> {
    const { id } = request.params;
    reply.code(200).send({message: `Get author by id ${id}`});
}

export async function updateAuthorById(
    request: FastifyRequest<{ Params: AuthorParams; Body: Omit<Author, 'id'> }>,
    reply: FastifyReply
): Promise<void> {
    const { id } = request.params;
    const body = request.body;
    reply.code(200).send({
        message: `Author with id ${id} updated`,
        data: body
    });
}

export async function searchAuthors(
    request: FastifyRequest<{ Querystring: SearchQuery }>,
    reply: FastifyReply
): Promise<void> {
    const { q } = request.query;
    reply.code(200).send({message: `Search authors with query ${q}`,
        data: []
    });
}


