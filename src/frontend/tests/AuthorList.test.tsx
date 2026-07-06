import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthorList } from '../components/AuthorList';
import type { Author } from '../types';

const authors: Author[] = [
  {
    id: 'author-1',
    firstName: 'Ada',
    lastName: 'Lovelace',
    email: 'ada@example.com',
  },
  {
    id: 'author-2',
    firstName: 'Grace',
    lastName: 'Hopper',
    email: 'grace@example.com',
  },
];

afterEach(() => {
  cleanup();
});

describe('AuthorList', () => {
  it('renders one card for each author', () => {
    const { container } = render(
      <AuthorList
        authors={authors}
        mode="none"
        showDeleteAuthors={false}
        selectedAuthorIds={[]}
        onToggleAuthorSelection={vi.fn()}
        onStartUpdateAuthor={vi.fn()}
        onShowArticlesByAuthor={vi.fn()}
      />
    );

    expect(screen.getByText('Ada Lovelace')).toBeTruthy();
    expect(screen.getByText('Grace Hopper')).toBeTruthy();
    expect(container.querySelectorAll('.author-card')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /^update author$/i })).toHaveLength(2);
  });

  it('shows an empty state when there are no authors', () => {
    render(
      <AuthorList
        authors={[]}
        mode="none"
        showDeleteAuthors={false}
        selectedAuthorIds={[]}
        onToggleAuthorSelection={vi.fn()}
        onStartUpdateAuthor={vi.fn()}
        onShowArticlesByAuthor={vi.fn()}
      />
    );

    expect(screen.getByText('No authors found.')).toBeTruthy();
  });

  it('calls the author detail handler when an author card is clicked', async () => {
    const user = userEvent.setup();
    const onShowArticlesByAuthor = vi.fn();

    render(
      <AuthorList
        authors={authors}
        mode="none"
        showDeleteAuthors={false}
        selectedAuthorIds={[]}
        onToggleAuthorSelection={vi.fn()}
        onStartUpdateAuthor={vi.fn()}
        onShowArticlesByAuthor={onShowArticlesByAuthor}
      />
    );

    await user.click(screen.getByRole('button', { name: /ada lovelace/i }));

    expect(onShowArticlesByAuthor).toHaveBeenCalledWith(authors[0]);
  });
});
