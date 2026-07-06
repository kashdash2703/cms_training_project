// Frontend HTTP client — all requests to the backend go through here.
import type {
  Author,
  Article,
  AuthorSearchResponse,
  ArticleSearchResponse,
  ArticlesByAuthorResponse,
} from '../types';

// The frontend calls /api/... and Vite forwards it to the backend.
// Example: /api/authors becomes http://localhost:3000/authors.
const API_BASE = '/api';

// Reusable helper for all backend requests.
// <T> lets each caller say what response shape it expects.
async function request<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let response: Response;
  const headers = new Headers(options?.headers);

  // Only send JSON content-type when a request body exists.
  // DELETE requests usually have no body; adding this header there causes Fastify warnings.
  if (options?.body !== undefined && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    // fetch is the browser API used to call the backend.
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('Backend is unavailable. Start the backend server and refresh.');
  }

  // response.ok is false for HTTP errors like 400, 404, and 500.
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message =
      errorBody?.message ||
      (response.status >= 500
        ? 'Backend request failed. Start the backend server and refresh.'
        : 'Something went wrong');
    throw new Error(message);
  }

  // Convert the backend JSON response into the expected TypeScript type.
  return response.json() as Promise<T>;
}

// A single object that contains every backend operation the UI needs.
// Keeping API calls here keeps app.tsx focused on UI behavior.
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

    // The backend wraps each author in { author }, so the UI extracts the actual authors.
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
    const response = await request<ArticleSearchResponse>(
      `/articles/search?q=${encodeURIComponent(q)}`
    );

    // The backend wraps each article in { article }, so the UI extracts the actual articles.
    return response.results.map((result) => result.article);
  },
};
