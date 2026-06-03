import type {
    Article,
    CreateArticleWithExistingAuthorInput,
    CreateArticleInput,
    UpdateArticleInput,
} from '../../types/index.js';

import type { ArticleRepository } from '../article.repository.js';
import { sqlClient } from '../../db/sql_client.js';

type ArticleRow = {
    id: string;
    headline: string;
    content: string;
    authorId: string;
    authorFirstName: string;
    authorLastName: string;
    authorEmail: string;
}

function mapArticleRowToArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    headline: row.headline,
    content: row.content,
    author: {
      id: row.authorId,
      firstName: row.authorFirstName,
      lastName: row.authorLastName,
      email: row.authorEmail,
    },
  };
}

export class SqlArticleRepository implements ArticleRepository {
    async findAll():Promise<Article[]> {
        const result = await sqlClient.query<ArticleRow>(`
            SELECT
                id,
                headline,
                content,
                author_id AS "authorId",
                author_first_name AS "authorFirstName",
                author_last_name AS "authorLastName",
                author_email AS "authorEmail"
            FROM articles
            ORDER BY headline ASC
        `);
        return result.rows.map(mapArticleRowToArticle);
    }

    async findExistingArticle(input: CreateArticleWithExistingAuthorInput): Promise<Article | undefined> {
        const result = await sqlClient.query<ArticleRow>(
            `
            SELECT
                id,
                headline,
                content,
                author_id AS "authorId",
                author_first_name AS "authorFirstName",
                author_last_name AS "authorLastName",
                author_email AS "authorEmail"
            FROM articles
            WHERE
                LOWER(headline) = LOWER($1)
                AND LOWER(content) = LOWER($2)
                AND author_id = $3
            `,
            [  
                input.headline.trim(),
                input.content.trim(),
                input.authorId,
            ]
        );
        const row = result.rows[0];

        if (!row) {
            return undefined;
        }

        return mapArticleRowToArticle(row);   
    }

    async findByAuthorId(authorId: string): Promise<Article[]> {
        const result = await sqlClient.query<ArticleRow>(
            `
            SELECT
                id,
                headline,
                content,
                author_id AS "authorId",
                author_first_name AS "authorFirstName",
                author_last_name AS "authorLastName",
                author_email AS "authorEmail"
            FROM articles
            WHERE author_id = $1
            ORDER BY headline ASC
            `,
            [authorId]
        );

        return result.rows.map(mapArticleRowToArticle);
    }

    async findById(id: string): Promise<Article | undefined> {
        const result = await sqlClient.query<ArticleRow>(
            `
            SELECT
                id,
                headline,
                content,
                author_id AS "authorId",
                author_first_name AS "authorFirstName",
                author_last_name AS "authorLastName",
                author_email AS "authorEmail"
            FROM articles
            WHERE id = $1
            `,
            [id]
        );

        const row = result.rows[0];

        if (!row) {
            return undefined;
        }

        return mapArticleRowToArticle(row);
    }

    async create(input: CreateArticleWithExistingAuthorInput ): Promise<Article> {
        const authorResult = await sqlClient.query(
            `
            SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email
            FROM authors
            WHERE id = $1
            `,
            [input.authorId]
        );

        const author = authorResult.rows[0];

        if (!author) {
            throw new Error('Author not found');
        }

        const result = await sqlClient.query<ArticleRow>(
            `
            INSERT INTO articles (
                headline,
                content,
                author_id,
                author_first_name,
                author_last_name,
                author_email
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING
                id,
                headline,
                content,
                author_id AS "authorId",
                author_first_name AS "authorFirstName",
                author_last_name AS "authorLastName",
                author_email AS "authorEmail"
            `,
            [
                input.headline.trim(),
                input.content.trim(),
                author.id,
                author.firstName,
                author.lastName,
                author.email,
            ]
        );

        const row = result.rows[0];

         if (!row) {
            throw new Error('Article creation failed');
        }

        return mapArticleRowToArticle(row);
    }


    async search(q: string): Promise<Article[]> {
        const searchText = `%${q.trim().toLowerCase()}%`;

        const result = await sqlClient.query<ArticleRow>(
            `
            SELECT
                id,
                headline,
                content,
                author_id AS "authorId",
                author_first_name AS "authorFirstName",
                author_last_name AS "authorLastName",
                author_email AS "authorEmail"
            FROM articles
            WHERE
                LOWER(headline) LIKE $1
                OR LOWER(content) LIKE $1
            ORDER BY headline ASC
            `,
            [searchText]
        );

        return result.rows.map(mapArticleRowToArticle); 
    }

    async updateById(id: string, input: UpdateArticleInput): Promise<Article | undefined> {
        const result = await sqlClient.query<ArticleRow>(
            `
            UPDATE articles
            SET
                headline = COALESCE($1, headline),
                content = COALESCE($2, content)
            WHERE id = $3
            RETURNING
                id,
                headline,
                content,
                author_id AS "authorId",
                author_first_name AS "authorFirstName",
                author_last_name AS "authorLastName",
                author_email AS "authorEmail"
            `,
            [
                input.headline?.trim(),
                input.content?.trim(),
                id,
            ]
        );

        const row = result.rows[0];

        if (!row) {
            return undefined;
        }

            return mapArticleRowToArticle(row);
    }

    async deleteById(id: string): Promise<boolean> {
        const result = await sqlClient.query(
            `
            DELETE FROM articles
            WHERE id = $1
            `,
            [id]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }    
}

