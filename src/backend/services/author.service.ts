import type { 
    Author, 
    AuthorSearchResult, 
    CreateAuthorInput, 
    UpdateAuthorInput, 
    UpdateAuthorResult 
    } from '../types/index.js';

export class AuthorService {

    // Database for authors
    private authors: Author[] = [];
    
    // Helper functions

    // a. getAuthorByEmail - Check if author already exists by email since email is unique for each author
    // To check 409 conflict in 2. createAuthor()

    getAuthorByEmail(email: string): Author | undefined {
        return this.authors.find(
            (author) => author.email === email
        );
    }
 
    // Main functions

    // 1. GET /authors - Get a list of all authors
    getAuthors(): Author[]  {
        return this.authors; // return all authors from the DB
    }

    // 2. POST /authors - Create a new author
    createAuthor(input: CreateAuthorInput): Author | null {
        const existingAuthor = this.getAuthorByEmail(input.email);

        if (existingAuthor) {
            return null;
        }

        const newAuthor: Author = {
            id: crypto.randomUUID(), // generates a unique ID for the author
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
        };

        this.authors.push(newAuthor); // add the new author to the DB

        return newAuthor;
    }

    // 3. GET /authors/search - Search authors based on query
    searchAuthors(q: string): AuthorSearchResult {
        // Convert the user search text to lowercase once
        // This helps us perform case-insensitive search
        const searchText = q.toLowerCase();

         // temporary variable created inside filter()
        const matchingAuthors = this.authors.filter ((author) => {
            return (
                author.firstName.toLowerCase().includes(searchText) || // || - (OR)
                author.lastName.toLowerCase().includes(searchText) ||
                author.email.toLowerCase().includes(searchText) 
            );
        });
        
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
    getAuthorById(id: string): Author | undefined {
        return this.authors.find(
            (author) => author.id === id
        );
    }

    // 5. PUT /authors/:id - Update an existing author
    // Updates firstName, lastName or email of an existing author
    // NOTE: articles of that particular author remain unchanged
    updateAuthorById(id: string, input: UpdateAuthorInput): UpdateAuthorResult {
        const author = this.getAuthorById(id);

        if (!author) {
            return {success: false, reason: 'not_found'};
        }

        if (input.email !== undefined) {
            const existingAuthorWithSameEmail = this.getAuthorByEmail(input.email);

            const emailBelongsToAnotherAuthor =
            existingAuthorWithSameEmail !== undefined &&
            existingAuthorWithSameEmail.id !== id;

            if (emailBelongsToAnotherAuthor) {
                return {success: false, reason: 'already_exists'};
            }
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

        return {success: true, author};
    }

    // 6. DELETE /authors/:id - Delete an existing author
    deleteAuthorById(id: string): boolean {
        const authorIndex = this.authors.findIndex(
            (author) => author.id === id
        );

        if (authorIndex === -1) {
            return false;
        }

        this.authors.splice(authorIndex, 1);

        return true;
    }
}
