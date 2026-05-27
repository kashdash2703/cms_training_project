export interface Author {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Article {
    id: string;
    headline: string;
    content: string;
    author: Author;
}

export interface ArticleWithExistingAuthor {
  id: string;
  headline: string;
  content: string;
  authorId: string;
}
export interface CreateArticleWithExistingAuthorInput {
  headline: string;
  content: string;
  authorId: string;
}

export interface AuthorSearchResult {
  totalSearchResults: number;
  results: {
    author: Author;
  }[];
}

export interface ArticleSearchResult {
  totalSearchResults: number;
  results: {
    article: Article;
  }[];
}

export interface CreateAuthorInput {
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateAuthorInput {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface CreateArticleInput {
  headline: string;
  content: string;
  author: CreateAuthorInput;
}

export interface UpdateArticleInput {
  headline?: string;
  content?: string;
  author?: CreateAuthorInput;
}

export type UpdateAuthorResult =
  | { success: true; author: Author }            // Updated successfully - 200
  | { success: false; reason: 'not_found' }      // Author not found - 404
  | { success: false; reason: 'already_exists' } // Email conflict - 409

export type UpdateArticleResult =
  | { success: true; article: Article }            // Updated successfully - 200
  | { success: false; reason: 'not_found' }      // Author not found - 404
  | { success: false; reason: 'already_exists' } // Email conflict - 409

export interface AuthorParams {
  id: string;
}

export interface ArticleParams {
  id: string;
}

export interface SearchQuery {
  q: string;
}

