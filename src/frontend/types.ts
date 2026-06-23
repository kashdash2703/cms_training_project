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
