
import type {
    Article,
    CreateArticleWithExistingAuthorInput,
    CreateArticleInput,
    UpdateArticleInput
} from '../types/index.js';

export interface ArticleRepository {
    findExistingArticle(input: CreateArticleWithExistingAuthorInput): Promise<Article | undefined>;
    findAll():Promise<Article[]>;
    create(input: CreateArticleInput | CreateArticleWithExistingAuthorInput ) : Promise<Article>;
    search(q: string): Promise<Article[]>;
    findByAuthorId(authorId: string): Promise<Article[]>;
    findById(id: string): Promise<Article | undefined>;
    updateById(id: string, input: UpdateArticleInput): Promise<Article | undefined>;
    deleteById(id: string): Promise<boolean>;
}
