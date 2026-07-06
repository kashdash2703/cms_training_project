import type { ArticleFormState, Author } from '../types';

type CreateArticleFormProps = {
  authors: Author[];
  articleForm: ArticleFormState;
  onArticleFormChange: (articleForm: ArticleFormState) => void;
  onSubmit: (event: React.SubmitEvent<HTMLFormElement>) => void;
};

export function CreateArticleForm({
  authors,
  articleForm,
  onArticleFormChange,
  onSubmit,
}: CreateArticleFormProps) {
  return (
    <section className="panel">
      <h2>Create Article</h2>

      <form onSubmit={onSubmit}>
        <input
          placeholder="Headline"
          value={articleForm.headline}
          onChange={(event) =>
            onArticleFormChange({ ...articleForm, headline: event.target.value })
          }
        />

        <textarea
          placeholder="Content"
          value={articleForm.content}
          onChange={(event) =>
            onArticleFormChange({ ...articleForm, content: event.target.value })
          }
        />

        <select
          value={articleForm.authorId}
          onChange={(event) =>
            onArticleFormChange({ ...articleForm, authorId: event.target.value })
          }
        >
          <option value="">Select existing author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.firstName} {author.lastName}
            </option>
          ))}
        </select>

        <button type="submit">Create Article</button>
      </form>
    </section>
  );
}
