import type {
  Author,
  Article,
  AuthorSearchResponse,
  ArticleSearchResponse,
  ArticlesByAuthorResponse,
} from './types';

const API_BASE = '/api';

async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let response: Response;
  const headers = new Headers(options?.headers);

  if (options?.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Backend is unavailable. Start the backend server and refresh.');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.message ||
      (response.status >= 500
        ? 'Backend request failed. Start the backend server and refresh.'
        : 'Something went wrong');
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const cmsApi = {
  getAuthors(): Promise<Author[]> {
    return request<Author[]>('/authors');
  },

  createAuthor(author: {
    firstName: string;
    lastName: string;
    email: string;
  }): Promise<Author> {
    return request<Author>('/authors', {
      method: 'POST',
      body: JSON.stringify(author),
    });
  },

  updateAuthor(
    id: string,
    author: {
      firstName?: string;
      lastName?: string;
      email?: string;
    }
  ): Promise<Author> {
    return request<Author>(`/authors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(author),
    });
  },

  deleteAuthor(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/authors/${id}`, {
      method: 'DELETE',
    });
  },

  async searchAuthors(q: string): Promise<Author[]> {
    const response = await request<AuthorSearchResponse>(
      `/authors/search?q=${encodeURIComponent(q)}`
    );

    return response.results.map((result) => result.author);
  },

  getArticles(): Promise<Article[]> {
    return request<Article[]>('/articles');
  },

  getArticlesByAuthorId(id: string): Promise<ArticlesByAuthorResponse> {
    return request<ArticlesByAuthorResponse>(`/articles/author/${id}`);
  },

  createArticleWithExistingAuthor(article: {
    headline: string;
    content: string;
    authorId: string;
  }): Promise<Article> {
    return request<Article>('/articles', {
      method: 'POST',
      body: JSON.stringify(article),
    });
  },

  updateArticle(
    id: string,
    article: {
      headline?: string;
      content?: string;
    }
  ): Promise<Article> {
    return request<Article>(`/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(article),
    });
  },

  deleteArticle(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/articles/${id}`, {
      method: 'DELETE',
    });
  },

  async searchArticles(q: string): Promise<Article[]> {
    try {
      const response = await request<ArticleSearchResponse>(
        `/articles/search?q=${encodeURIComponent(q)}`
      );

      return response.results.map((result) => result.article);
    } catch (error) {
      /*
        Your backend returns 404 when no articles are found.
        For frontend, we show empty results instead of crashing.
      */
      return [];
    }
  },
};
