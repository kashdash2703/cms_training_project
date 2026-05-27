import type {
    Author,
    UpdateAuthorInput,
    CreateAuthorInput,
    AuthorSearchResult,
    UpdateAuthorResult
} from '../types/index.js';

export interface AuthorRepository {
    findByEmail(email: string): Promise<Author | undefined>;
    findAll():Promise<Author[]>;
    create(input: CreateAuthorInput): Promise<Author | null>;
    search(q: string): Promise<AuthorSearchResult>;
    findById(id: string): Promise<Author | undefined>;
    updateById(id:string, input: UpdateAuthorInput): Promise<UpdateAuthorResult>;
    deleteById(id: string): Promise<boolean>;
}
