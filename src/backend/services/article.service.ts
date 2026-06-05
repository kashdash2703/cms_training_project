import type { 
  Article, 
  ArticleSearchResult,
  CreateArticleInput, 
  CreateArticleWithExistingAuthorInput,
  UpdateArticleInput, 
  UpdateArticleResult,
  } from '../types/index.js';

import type { ArticleRepository } from '../repositories/article.repository.js';
import { AuthorService } from './author.service.js';

export class ArticleService {

  // Database for articles
  constructor(
    private articleRepository: ArticleRepository,
    // ArticleService needs AuthorService because every article has an author
    private authorService: AuthorService
  ) {}

  // According to OpenAPI Spec - each operationId 
  // getArticles(), createArticle(), searchArticles(), .. are methods - main service functions
  // Helper functions may also be needed
  // getArticleById(), getExistingArticle(), ExistingAuthorId(),.. - not API endpoints - but internal support functions which makes service logic easier

  //  Helper functions
  // A. getExistingArticle - Check if the article already exists

   private async getExistingArticle(input: CreateArticleWithExistingAuthorInput): Promise<Article | undefined> {
    return this.articleRepository.findExistingArticle(input);
    }

  // B. ExistingAuthorId - Check whether the Author ID is already present

  private hasExistingAuthorId(input: CreateArticleInput | CreateArticleWithExistingAuthorInput): input is CreateArticleWithExistingAuthorInput {
    return 'authorId' in input;
  }


  // Main service functions
  // 1. GET /articles - Get a list of all articles

  async getArticles(): Promise<Article[]> {
    return this.articleRepository.findAll();
  }

  // 2. POST /articles - Create a new article

  async createArticle(input: CreateArticleInput | CreateArticleWithExistingAuthorInput ) : Promise<UpdateArticleResult> {
    let articleAuthor;

    if (this.hasExistingAuthorId(input)) {
      const existingAuthor = await this.authorService.getAuthorById(input.authorId);

      if (!existingAuthor) {
        return {
          success: false, reason: 'not_found',
        };
      }
      articleAuthor = existingAuthor;
    } 
    
    else {
      const createdAuthor = await this.authorService.createAuthor(input.author);

      if (createdAuthor) {
        articleAuthor = createdAuthor;
      }

      else {
        const existingAuthor = await this.authorService.getAuthorByEmail(
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

    const existingArticle = await this.getExistingArticle(existingArticleInput);

    if (existingArticle) {
      return {
        success: false,
        reason: 'already_exists',
      };
    }

    const newArticle = await this.articleRepository.create(existingArticleInput);

    return {
      success: true,
      article: newArticle,
    };
  }

  // 3. GET /articles/search - Search articles by keyword

 async searchArticles(q: string): Promise<ArticleSearchResult> {
    const searchText = q.trim().toLowerCase();

    const matchingArticles = await this.articleRepository.search(searchText);
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
  async getArticlesByAuthorId(id: string): Promise<{ author: Article['author']; articles: Article[] } | undefined> {
    const author = await this.authorService.getAuthorById(id);

    if (!author) {
      return undefined;
    }

    const articlesByAuthor = await this.articleRepository.findByAuthorId(id);

    return {
      author,
      articles: articlesByAuthor,
    };
  }

  // 5. getArticleById - Get article by ID

  async getArticleById(id: string): Promise<Article | undefined> {
    return this.articleRepository.findById(id);
      // (article) => article.id=== id);
  }

  // 6. PUT /articles/:id - Update an existing article

  async updateArticleById( id: string, input: UpdateArticleInput): Promise<UpdateArticleResult> {
    const article = await this.articleRepository.updateById(id, input);

    if (!article) {
      return {
        success: false,
        reason: 'not_found',
      };
    }

    return {
      success: true,
      article,
    };
  }
  
  // 7. DELETE /articles/:id - Delete an article

  async deleteArticleById(id: string): Promise<boolean> {

    return this.articleRepository.deleteById(id);
  }
}
  





















































