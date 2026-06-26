import type { ArticleFormState } from '../types';

type UpdateArticleFormProps = {
  articleForm: ArticleFormState;
  onArticleFormChange: (articleForm: ArticleFormState) => void;
  onSubmit: (event: React.FormEvent) => void;
};

export function UpdateArticleForm({
  articleForm,
  onArticleFormChange,
  onSubmit,
}: UpdateArticleFormProps) {
  return (
    <section className="panel">
      <h2>Update Article</h2>

      <form onSubmit={onSubmit}>
        <input
          value={articleForm.headline}
          onChange={(event) =>
            onArticleFormChange({ ...articleForm, headline: event.target.value })
          }
        />

        <textarea
          value={articleForm.content}
          onChange={(event) =>
            onArticleFormChange({ ...articleForm, content: event.target.value })
          }
        />

        <button type="submit">Save Article</button>
      </form>
    </section>
  );
}
