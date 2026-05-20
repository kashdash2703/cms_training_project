export type Author = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type CreateAuthorInput = { // no id present- bcz backend creates an ID
    firstName: string;
    lastName: string;
    email:string;
}

export type UpdateAuthorInput = { // parameters are optional - bcz any of the fields can be updated
    firstName?: string;
    lastName?: string;
    email?: string;
}

const authors: Author[] =[]; // nop database conncted yet - therefore in empty array which is a temporary database

export class AuthorService {
    createAuthor(input: CreateAuthorInput): Author {
        const newAuthor: Author={
            id: crypto.randomUUID(), // generates a unique ID for the author
            firstName: input.firstName,
            lastName: input.lastName,
            email: input.email,
        };
        authors.push(newAuthor); // add the author to the DB/ temp DB-array
        return newAuthor;
    }

    getAuthorById(id: string): Author | undefined {
        return authors.find(author => author.id === id); // find the author by ID in the DB/ temp DB-array
    }

    updateAuthorById(id:string, input: UpdateAuthorInput): Author | undefined {
        const author = authors.find((author) => author.id === id);

        if (!author) {
            return undefined;
        }

        if (input.firstName !== undefined) {
            author.firstName = input.firstName;
        }

        if(input.lastName !== undefined) {
            author.lastName = input.lastName;
        }

        if (input.email !== undefined) {
            author.email = input.email;
        }
        return author;
    }

    searchAuthors(searchText : string): Author[] {
        const lowerSearchText = searchText.toLowerCase();

        return authors.filter((author) => {
            return (
                author.firstName.toLowerCase().includes(lowerSearchText) ||
                author.lastName.toLowerCase().includes(lowerSearchText) ||
                author.email.toLowerCase().includes(lowerSearchText)
            );
        });
    }

    getAllAuthors(): Author[] {
        return authors;
    }

}
        



    





        



    





