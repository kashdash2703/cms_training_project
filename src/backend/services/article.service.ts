import type { 
  Article, 
  ArticleSearchResult,
  CreateArticleInput, 
  CreateArticleWithExistingAuthorInput,
  UpdateArticleInput, 
  UpdateArticleResult,
  ArticleParams
  } from '../types/index.js';

import { AuthorService } from './author.service.js';

export class ArticleService {

  // Database for articles
  private articles: Article[] = [];

  // ArticleService needs AuthorService because every article has an author
  constructor(private authorService: AuthorService) {}

  // According to OpenAPI Spec - each operationId 
  // getArticles(), createArticle(), searchArticles(), .. are methods - main service functions
  // Helper functions may also be needed
  // getArticleById(), getExistingArticle(), ExistingAuthorId(),.. - not API endpoints - but internal support functions which makes service logic easier

  //  Helper functions
  // A. getExistingArticle - Check if the article already exists

   private getExistingArticle(input: CreateArticleWithExistingAuthorInput): Article | undefined {
    const normalizedHeadline = input.headline.trim().toLowerCase();
    const normalizedContent = input.content.trim().toLowerCase();
  
    return this.articles.find((article) => {
      return (
        article.headline.trim().toLowerCase() === normalizedHeadline &&
        article.content.trim().toLowerCase() === normalizedContent &&
        article.author.id === input.authorId
      );
    });
  }

  // B. ExistingAuthorId - Check whether the Author ID is already present

  private ExistingAuthorId(input: CreateArticleInput | CreateArticleWithExistingAuthorInput): input is CreateArticleWithExistingAuthorInput {
    return 'authorId' in input;
  }


  // Main service functions
  // 1. GET /articles - Get a list of all articles

  getArticles(): Article[] {
    return this.articles;
  }

  // 2. POST /articles - Create a new article

  createArticle(input: CreateArticleInput | CreateArticleWithExistingAuthorInput ) : UpdateArticleResult {
    let articleAuthor;

    if (this.ExistingAuthorId(input)) {
      const existingAuthor = this.authorService.getAuthorById(input.authorId);

      if (!existingAuthor) {
        return {
          success: false, reason: 'not_found',
        };
      }
      articleAuthor = existingAuthor;
    } 
    
    else {
      const createdAuthor = this.authorService.createAuthor(input.author);

      if (createdAuthor) {
        articleAuthor = createdAuthor;
      }

      else {
        const existingAuthor = this.authorService.getAuthorByEmail(
          input.author.email
        );

        if (!existingAuthor) {
          return {
            success: false,
            reason: 'not_found',
          };
        }
        articleAuthor = existingAuthor;
        }
      }

    
    const existingArticleInput: CreateArticleWithExistingAuthorInput = {
      headline: input.headline,
      content: input.content,
      authorId: articleAuthor.id,
    };

    const existingArticle = this.getExistingArticle(existingArticleInput);

    if (existingArticle) {
      return {
        success: false,
        reason: 'already_exists',
      };
    }

    const newArticle: Article = {
      id: crypto.randomUUID(),
      headline: input.headline.trim(),
      content: input.content.trim(),
      author: articleAuthor,
    };

    this.articles.push(newArticle);

    return {
      success: true,
      article: newArticle,
    };
  }

  // 3. GET /articles/search - Search articles by keyword

  searchArticles(q: string): ArticleSearchResult {
    const searchText = q.trim().toLowerCase();

    const matchingArticles = this.articles.filter((article) => {
      return (
        article.headline.toLowerCase().includes(searchText) ||
        article.content.toLowerCase().includes(searchText)
      );
    });

    return {
      totalSearchResults: matchingArticles.length,
      results: matchingArticles.map((article) => {
        return {
          article,
        };
      }),
    };
  }

  // 4. GET /articles/author/:id - Get list of articles written by an author
  getArticlesByAuthorId(id: string): { author: Article['author']; articles: Article[] } | undefined {
    const author = this.authorService.getAuthorById(id);

    if (!author) {
      return undefined;
    }

    const articlesByAuthor = this.articles.filter((article) => {
      return article.author.id === id;
    });

    return {
      author,
      articles: articlesByAuthor,
    };
  }

  // 5. getArticleById - Get article by ID

  getArticleById(id: string): Article | undefined {
    return this.articles.find((article) => article.id=== id);
  }

  // 6. PUT /articles/:id - Update an existing article

  updateArticleById( id: string, input: UpdateArticleInput): UpdateArticleResult {
    const article = this.getArticleById(id);

    if (!article) {
      return {
        success: false,
        reason: 'not_found',
      };
    }

    if (input.headline !== undefined) {
      article.headline = input.headline.trim();
    }

    if (input.content !== undefined) {
      article.content = input.content.trim();
    }

    return {
      success: true,
      article,
    };
  }
  
  // 7. DELETE /articles/:id - Delete an article

  deleteArticleById(id: string): boolean {
    const articleIndex = this.articles.findIndex(
      (article) => article.id === id
    );

    if (articleIndex === -1) {
      return false;
    }

    this.articles.splice(articleIndex, 1);

    return true;
  }
}
  





















































