import type { AuthorFormState } from '../types';

type CreateAuthorFormProps = {
  authorForm: AuthorFormState;
  onAuthorFormChange: (authorForm: AuthorFormState) => void;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

export function CreateAuthorForm({
  authorForm,
  onAuthorFormChange,
  onSubmit,
}: CreateAuthorFormProps) {
  return (
    <section className="panel">
      <h2>Create Author</h2>

      <form onSubmit={onSubmit}>
        <input
          placeholder="First name"
          value={authorForm.firstName}
          onChange={(event) =>
            onAuthorFormChange({ ...authorForm, firstName: event.target.value })
          }
        />

        <input
          placeholder="Last name"
          value={authorForm.lastName}
          onChange={(event) =>
            onAuthorFormChange({ ...authorForm, lastName: event.target.value })
          }
        />

        <input
          placeholder="Email"
          value={authorForm.email}
          onChange={(event) =>
            onAuthorFormChange({ ...authorForm, email: event.target.value })
          }
        />

        <button type="submit">Create Author</button>
      </form>
    </section>
  );
}
