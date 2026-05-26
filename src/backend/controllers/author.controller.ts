import type { FastifyRequest, FastifyReply } from 'fastify';
import type { 
    CreateAuthorInput,
    UpdateAuthorInput,
    AuthorParams,
    SearchQuery,
    } from '../types/index.js';
import { AuthorService } from '../services/author.service.js';

const authorService = new AuthorService();

//  Helper functions
// a. isValidCreateAuthorInput - Validate Create author input
function isValidCreateAuthorInput(body: CreateAuthorInput): boolean {
  return (
    typeof body.firstName === 'string' &&
    body.firstName.trim() !== '' &&
    typeof body.lastName === 'string' &&
    body.lastName.trim() !== '' &&
    typeof body.email === 'string' &&
    body.email.trim() !== ''
  );
}

// b. isValidUpdateAuthorInput - Validate Update author input
function isValidUpdateAuthorInput(body: UpdateAuthorInput): boolean {
  return (
    body.firstName !== undefined ||
    body.lastName !== undefined ||
    body.email !== undefined
  );
}

// Main functions
// 1. GET /authors - Get a list of all authors
export async function getAuthors (
    request: FastifyRequest,
    reply: FastifyReply
): Promise<void> {
    const authors = authorService.getAuthors();
    
    return reply.code(200).send(authors);
}

// 2. POST /authors - Create a new author
export async function createAuthor (
    request: FastifyRequest<{ Body: CreateAuthorInput }>,
    reply: FastifyReply
): Promise<void> {
    const body = request.body;

    if (!isValidCreateAuthorInput(body)) { 
        return reply.code(400).send({ message: 'Invalid input' });
    }

    const author = authorService.createAuthor(body);

    if (!author) {
        return reply.code(409).send({ message: 'Author already exists' });
    }
    
    return reply.code(201).send(author);
}


//3. GET /authors/search - Search for authors based on query
export async function searchAuthors (
    request: FastifyRequest<{ Querystring: SearchQuery }>,
    reply: FastifyReply
): Promise<void> { 
    const { q } = request.query;
    
    if (!q || q.trim() === '') {
        return reply.code(400).send({ message: 'Invalid search query' });
    }
    
    const searchResult = authorService.searchAuthors(q);
    
    if (searchResult.totalSearchResults === 0) {
        return reply.code(404).send({ message: 'No authors found' });
    }
    
    return reply.code(200).send(searchResult);
}


// 4. GET /authors/:id - Get author by ID
export async function getAuthorById (
    request: FastifyRequest<{ Params: AuthorParams }>,
    reply: FastifyReply
): Promise<void> {
    const { id } = request.params;
    
    const author = authorService.getAuthorById(id);

  if (!author) {
    return reply.code(404).send({ message: 'Author not found' });
  }

  return reply.code(200).send(author);
}

// 5. PUT /authors/:id - Update an existing author by their ID
export async function updateAuthorById (
    request: FastifyRequest<{ Params: AuthorParams; Body: UpdateAuthorInput }>,
    reply: FastifyReply
): Promise<void> {
    const { id } = request.params;
    const body = request.body;
    
    if (!isValidUpdateAuthorInput(body)) {
        return reply.code(400).send({ message: 'Invalid input' });
    }
    
    const result = authorService.updateAuthorById(id, body);
    
    if (!result.success && result.reason === 'not_found') {
        return reply.code(404).send({ message: 'No author found' });
    }
    
    if (!result.success && result.reason === 'already_exists') {
        return reply.code(400).send({ message: 'Invalid input' });
    }
    
    return reply.code(200).send(result.author);
}

// 6. DELETE /authors/:id - Delete an author by their ID and respective articles remain unaffected
export async function deleteAuthorById (
  request: FastifyRequest<{ Params: AuthorParams }>,
  reply: FastifyReply
): Promise<void> {
  const { id } = request.params;
  
  const isDeleted = authorService.deleteAuthorById(id);

  if (!isDeleted) {
    return reply.code(404).send({ message: 'Author not found' });
  }

  return reply.code(200).send({
    message: 'Author details deleted successfully and articles remain unaffected',
  });
}


