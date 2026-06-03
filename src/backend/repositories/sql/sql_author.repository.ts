import type {
    Author,
    UpdateAuthorInput,
    CreateAuthorInput
} from '../../types/index.js';

import type { AuthorRepository } from '../author.repository.js';
import { sqlClient } from '../../db/sql_client.js';

export class SqlAuthorRepository implements AuthorRepository {
    async findAll(): Promise<Author[]> {
        const result = await sqlClient.query(`
        SELECT
            id,
            first_name AS "firstName",
            last_name AS "lastName",
            email
        FROM authors
        ORDER BY first_name ASC
        `);

    return result.rows;
    }

    async findByEmail(email: string): Promise<Author | undefined> {
        const result = await sqlClient.query(
             `
            SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email
            FROM authors
            WHERE LOWER(email) = LOWER($1)
            `,
            [email.trim()]
        );
        return result.rows[0];
    }

    async findById(id: string): Promise<Author | undefined> {
        const result = await sqlClient.query(
             `
            SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email
            FROM authors
            WHERE id = $1
      `,
      [id]
    );
    return result.rows[0];
    }


    async create(input: CreateAuthorInput): Promise<Author> {
        const result = await sqlClient.query(
            `
            INSERT INTO authors (
                first_name,
                last_name,
                email
            )
            VALUES ($1, $2, $3)
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email
            `,
            [
                input.firstName.trim(),
                input.lastName.trim(),
                input.email.trim(),
            ]
        );

        return result.rows[0];
    }

    async search(q: string): Promise<Author[]> {
        const searchText = `%${q.trim().toLowerCase()}%`;

        const result = await sqlClient.query(
            `
            SELECT
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email
            FROM authors
            WHERE
                LOWER(first_name) LIKE $1
                OR LOWER(last_name) LIKE $1
                OR LOWER(email) LIKE $1
            ORDER BY first_name ASC
            `,
            [searchText]
        );

        return result.rows;
  }

    async updateById(id:string, input: UpdateAuthorInput): Promise<Author | undefined> {
        const result = await sqlClient.query(
            `
            UPDATE authors
            SET
                first_name = COALESCE($1, first_name),
                last_name = COALESCE($2, last_name),
                email = COALESCE($3, email)
            WHERE id = $4
            RETURNING
                id,
                first_name AS "firstName",
                last_name AS "lastName",
                email
            `,
            [
                input.firstName?.trim(),
                input.lastName?.trim(),
                input.email?.trim(),
                id,
            ]
        );

        return result.rows[0];
    }


    async deleteById(id: string): Promise<boolean> {
        const result = await sqlClient.query(
            `
            DELETE FROM authors
            WHERE id = $1
            `,
            [id]
        );

        return result.rowCount !== null && result.rowCount > 0;
    }

}