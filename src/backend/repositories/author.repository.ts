import type {
    Author,
    UpdateAuthorInput,
    CreateAuthorInput
} from '../types/index.js';

export interface AuthorRepository {
    findByEmail(email: string): Promise<Author | undefined>;
    findAll(): Promise<Author[]>;
    create(input: CreateAuthorInput): Promise<Author>;
    search(q: string): Promise<Author[]>;
    findById(id: string): Promise<Author | undefined>;
    updateById(id:string, input: UpdateAuthorInput): Promise<Author | undefined>;
    deleteById(id: string): Promise<boolean>;
}
