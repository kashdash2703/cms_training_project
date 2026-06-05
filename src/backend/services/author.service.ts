import type { 
    Author, 
    AuthorSearchResult, 
    CreateAuthorInput, 
    UpdateAuthorInput, 
    UpdateAuthorResult 
    } from '../types/index.js';

import type { AuthorRepository } from '../repositories/author.repository.js';

export class AuthorService {

    // Database for authors
    constructor(private authorRepository: AuthorRepository) {}
    
    // Helper functions

    // a. getAuthorByEmail - Check if author already exists by email since email is unique for each author
    // To check 409 conflict in 2. createAuthor()

    async getAuthorByEmail(email: string): Promise<Author | undefined> {
        return this.authorRepository.findByEmail(email);
    }
 
    // Main functions

    // 1. GET /authors - Get a list of all authors
    async getAuthors(): Promise<Author[]>  {
        return this.authorRepository.findAll(); // return all authors from the DB
    }

    // 2. POST /authors - Create a new author
    async createAuthor(input: CreateAuthorInput): Promise<Author | null> {
        const existingAuthor = await this.getAuthorByEmail(input.email);

        if (existingAuthor) {
            return null;
        }

        const newAuthor = await this.authorRepository.create({
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
        });

        //this.authors.push(newAuthor); // add the new author to the DB

        return newAuthor;
    }

    // 3. GET /authors/search - Search authors based on query
    async searchAuthors(q: string): Promise<AuthorSearchResult> {
        // Convert the user search text to lowercase once
        // This helps us perform case-insensitive search
        const searchText = q.trim().toLowerCase();

         // temporary variable created inside filter()
        const matchingAuthors = await this.authorRepository.search (searchText);

        // Return the result in AuthorSearchResult format
        return {
            totalSearchResults: matchingAuthors.length, //   matchingAuthors.length -> number of matches found
            results: matchingAuthors.map((author) => { // .map() - used to transform each matching author into the format expected by API schema
                return {
                    author,
                };
            }),
        };
    }

    // 4. GET /authors/:id - Obtain author details by ID
    async getAuthorById(id: string): Promise<Author | undefined> {
        return this.authorRepository.findById(id);
    }

    // 5. PUT /authors/:id - Update an existing author
    // Updates firstName, lastName or email of an existing author
    // NOTE: articles of that particular author remain unchanged
    async updateAuthorById(id: string, input: UpdateAuthorInput): Promise<UpdateAuthorResult> {
        const author = await this.getAuthorById(id);

        if (!author) {
            return {success: false, reason: 'not_found'};
        }

        if (input.email !== undefined) {
            const existingAuthorWithSameEmail = await this.getAuthorByEmail(input.email);

            const emailBelongsToAnotherAuthor =
            existingAuthorWithSameEmail !== undefined &&
            existingAuthorWithSameEmail.id !== id;

            if (emailBelongsToAnotherAuthor) {
                return {success: false, reason: 'already_exists'};
            }
        }

        const updatedAuthor = await this.authorRepository.updateById(id, input);

        if (!updatedAuthor) {
            return {success: false, reason: 'not_found'}
        }

        return {success: true, author: updatedAuthor};
    }

    // 6. DELETE /authors/:id - Delete an existing author
    async deleteAuthorById(id: string): Promise<boolean> {

        // this.authors.splice(authorIndex, 1);
        return this.authorRepository.deleteById(id);
    }
}
