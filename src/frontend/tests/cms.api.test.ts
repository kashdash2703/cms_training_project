import { afterEach, describe, expect, it, vi } from 'vitest';
import { cmsApi } from '../api/cms.api';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cmsApi', () => {
  it('sends createAuthor as a JSON POST request', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({
            id: 'author-1',
            firstName: 'Ada',
            lastName: 'Lovelace',
            email: 'ada@example.com',
          }),
          {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      );

    await cmsApi.createAuthor({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/authors',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          firstName: 'Ada',
          lastName: 'Lovelace',
          email: 'ada@example.com',
        }),
      })
    );

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, options] = firstCall!;
    const headers = options?.headers as Headers;

    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('does not send a JSON content-type header for bodyless delete requests', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ message: 'Author deleted successfully' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

    await cmsApi.deleteAuthor('author-1');

    const firstCall = fetchMock.mock.calls[0];
    expect(firstCall).toBeDefined();

    const [, options] = firstCall!;
    const headers = options?.headers as Headers;

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/authors/author-1',
      expect.objectContaining({
        method: 'DELETE',
      })
    );
    expect(headers.has('Content-Type')).toBe(false);
  });
});
