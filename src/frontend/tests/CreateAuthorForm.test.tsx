import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { CreateAuthorForm } from '../components/CreateAuthorForm';
import type { AuthorFormState } from '../types';

afterEach(() => {
  cleanup();
});

function CreateAuthorFormHarness({
  onSubmitAuthor,
}: {
  onSubmitAuthor: (authorForm: AuthorFormState) => void;
}) {
  const [authorForm, setAuthorForm] = useState<AuthorFormState>({
    firstName: '',
    lastName: '',
    email: '',
  });

  return (
    <CreateAuthorForm
      authorForm={authorForm}
      onAuthorFormChange={setAuthorForm}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmitAuthor(authorForm);
      }}
    />
  );
}

describe('CreateAuthorForm', () => {
  it('submits the values typed by the user', async () => {
    const user = userEvent.setup();
    const onSubmitAuthor = vi.fn();

    render(<CreateAuthorFormHarness onSubmitAuthor={onSubmitAuthor} />);

    await user.type(screen.getByPlaceholderText('First name'), 'Ada');
    await user.type(screen.getByPlaceholderText('Last name'), 'Lovelace');
    await user.type(screen.getByPlaceholderText('Email'), 'ada@example.com');
    await user.click(screen.getByRole('button', { name: /create author/i }));

    expect(onSubmitAuthor).toHaveBeenCalledWith({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'ada@example.com',
    });
  });
});
