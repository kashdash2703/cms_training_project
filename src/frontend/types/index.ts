// Keep these frontend API types in sync with src/backend/types/index.ts.
// A future shared package can make backend and frontend import from one source of truth.
export type Author = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

export type Article = {
  id: string;
  headline: string;
  content: string;
  author: Author;
};

export type AuthorSearchResponse = {
  totalSearchResults: number;
  results: {
    author: Author;
  }[];
};

export type ArticleSearchResponse = {
  totalSearchResults: number;
  results: {
    article: Article;
  }[];
};

export type ArticlesByAuthorResponse = {
  author: Author;
  articles: Article[];
};

export type Mode = 'none' | 'create' | 'update-author' | 'update-article' | 'delete';

export type AuthorFormState = {
  firstName: string;
  lastName: string;
  email: string;
};

export type ArticleFormState = {
  headline: string;
  content: string;
  authorId: string;
};
