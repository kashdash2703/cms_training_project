export interface Author {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Article {
    id: number;
    headline: string;
    text: string;
    authorId: number;
}

export interface AuthorParams {
    id: string;
}

export interface ArticleParams {
    id: string;
}

export interface SearchQuery {
    q: string;
}

