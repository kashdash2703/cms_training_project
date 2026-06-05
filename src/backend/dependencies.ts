// import { SqlAuthorRepository } from './repositories/sql/sql_author.repository.js';
// import { SqlArticleRepository } from './repositories/sql/sql_article.repository.js';

// import { AuthorService } from './services/author.service.js';
// import { ArticleService } from './services/article.service.js';

// const authorRepository = new SqlAuthorRepository();
// const articleRepository = new SqlArticleRepository();

// export const authorService = new AuthorService(authorRepository);

// export const articleService = new ArticleService(
//   articleRepository,
//   authorService
// );

// MongoDB
import { MongoAuthorRepository } from './repositories/nosql/mongo_author.repository.js';
import { MongoArticleRepository } from './repositories/nosql/mongo_article.repository.js';

import { AuthorService } from './services/author.service.js';
import { ArticleService } from './services/article.service.js';

const authorRepository = new MongoAuthorRepository();
const articleRepository = new MongoArticleRepository();

export const authorService = new AuthorService(authorRepository);

export const articleService = new ArticleService(
  articleRepository,
  authorService
);