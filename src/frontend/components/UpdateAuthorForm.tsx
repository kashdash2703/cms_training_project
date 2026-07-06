import type { AuthorFormState } from '../types';

type UpdateAuthorFormProps = {
  authorForm: AuthorFormState;
  onAuthorFormChange: (authorForm: AuthorFormState) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function UpdateAuthorForm({
  authorForm,
  onAuthorFormChange,
  onSubmit,
}: UpdateAuthorFormProps) {
  return (
    <section className="panel">
      <h2>Update Author</h2>

      <form onSubmit={onSubmit}>
        <input
          value={authorForm.firstName}
          onChange={(event) =>
            onAuthorFormChange({ ...authorForm, firstName: event.target.value })
          }
        />

        <input
          value={authorForm.lastName}
          onChange={(event) =>
            onAuthorFormChange({ ...authorForm, lastName: event.target.value })
          }
        />

        <input
          value={authorForm.email}
          onChange={(event) =>
            onAuthorFormChange({ ...authorForm, email: event.target.value })
          }
        />

        <button type="submit">Save Author</button>
      </form>
    </section>
  );
}
