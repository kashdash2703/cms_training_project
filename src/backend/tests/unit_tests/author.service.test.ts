// Testing tools of vitest
// describe  → groups related tests together (like a folder)
// it        → one single test (like one experiment)
// expect    → checks if something is true or false
// beforeEach → runs something BEFORE every single test
import { describe, it, expect, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';

import { AuthorService } from '../../services/author.service.js';
import type { AuthorRepository } from '../../repositories/author.repository.js';

import type {
  Author,
  CreateAuthorInput,
  UpdateAuthorInput,
} from '../../types/index.js';


export class FakeAuthorRepository implements AuthorRepository {
  private authors: Author[] = [];

  async findAll(): Promise<Author[]> {
    return this.authors;
  }

  async findByEmail(email: string): Promise<Author | undefined> {
    return this.authors.find(
      (author) => author.email.toLowerCase() === email.toLowerCase()
    );
  }

  async findById(id: string): Promise<Author | undefined> {
    return this.authors.find((author) => author.id === id);
  }

  async search(q: string): Promise<Author[]> {
    const searchText = q.toLowerCase();

    return this.authors.filter((author) => {
      return (
        author.firstName.toLowerCase().includes(searchText) ||
        author.lastName.toLowerCase().includes(searchText) ||
        author.email.toLowerCase().includes(searchText)
      );
    });
  }

  async create(input: CreateAuthorInput): Promise<Author> {
    const newAuthor: Author = {
      id: randomUUID(),
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
    };

    this.authors.push(newAuthor);

    return newAuthor;
  }

  async updateById(
    id: string,
    input: UpdateAuthorInput
  ): Promise<Author | undefined> {
    const author = await this.findById(id);

    if (!author) {
      return undefined;
    }

    if (input.firstName !== undefined) {
      author.firstName = input.firstName;
    }

    if (input.lastName !== undefined) {
      author.lastName = input.lastName;
    }

    if (input.email !== undefined) {
      author.email = input.email;
    }

    return author;
  }

  async deleteById(id: string): Promise<boolean> {
    const index = this.authors.findIndex((author) => author.id === id);

    if (index === -1) {
      return false;
    }

    this.authors.splice(index, 1);

    return true;
  }
}

// Test setup
describe('AuthorService', () => { // describe - groups author services together
  let fakeAuthorRepository: FakeAuthorRepository; 
  let authorService: AuthorService;

  beforeEach(() => { // beforeEach - runs before every test, therefore every test starts with a fresh empty fake database and fresh authorService
    fakeAuthorRepository = new FakeAuthorRepository();
    authorService = new AuthorService(fakeAuthorRepository);
  });

  // T1 - Create author
  it('should create an author', async () => {
    const author = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar@example.com',
    });

    expect(author).not.toBeNull();
    expect(author?.id).toBeDefined();
    expect(author?.firstName).toBe('Kaviya');
    expect(author?.lastName).toBe('Jeyakumar');
    expect(author?.email).toBe('kaviya.jeyakumar@example.com');
  });


  // T2 - No duplicate authors with same email
  it('should not create duplicate author with same email', async () => {
    await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar@example.com',
    });

    const duplicateAuthor = await authorService.createAuthor({
      firstName: 'Kavya',
      lastName: 'Sukumar',
      email: 'kaviya.jeyakumar@example.com',
    });

    expect(duplicateAuthor).toBeNull();
  });

  // T3 - Get author by ID
  it('should get author by id', async () => {
    const createdAuthor = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar@example.com',
    });

    const author = await authorService.getAuthorById(createdAuthor!.id);

    expect(author).toBeDefined();
    expect(author?.email).toBe('kaviya.jeyakumar@example.com');
  });

  // T4 - Search Authors
  it('should search authors', async () => {
    await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar@example.com',
    });

    await authorService.createAuthor({
      firstName: 'Karunya',
      lastName: 'Kumar',
      email: 'karunya.kumar@example.com',
    });

    const result = await authorService.searchAuthors('kaviya');

    expect(result.totalSearchResults).toBe(1);
    expect(result.results[0]?.author?.firstName).toBe('Kaviya');
  });

  // T5 - Update author by ID
  it('should update author by id', async () => {
    const createdAuthor = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar@example.com',
    });

    const result = await authorService.updateAuthorById(createdAuthor!.id, {
      firstName: 'Jeya Shri',
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.author.firstName).toBe('Jeya Shri');
      expect(result.author.lastName).toBe('Jeyakumar');
    }
  });

  // T6 - Return not found for unknown author
  it('should return not_found when updating unknown author', async () => {
    const result = await authorService.updateAuthorById(
      'unknown-id',
      {
        firstName: 'Kaviya Shri',
      }
    );

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.reason).toBe('not_found');
    }
  });

  // T7- Delete author by authorId
  it('should delete author by id', async () => {
    const createdAuthor = await authorService.createAuthor({
      firstName: 'Kaviya',
      lastName: 'Jeyakumar',
      email: 'kaviya.jeyakumar@example.com',
    });

    const isDeleted = await authorService.deleteAuthorById(createdAuthor!.id);

    expect(isDeleted).toBe(true);

    const author = await authorService.getAuthorById(createdAuthor!.id);

    expect(author).toBeUndefined();
  });
});