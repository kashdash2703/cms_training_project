type DeletePanelProps = {
  showDeleteAuthors: boolean;
  showDeleteArticles: boolean;
  selectedAuthorCount: number;
  selectedArticleCount: number;
  onChooseTarget: (target: 'authors' | 'articles', checked: boolean) => void;
  onDeleteAuthors: () => void;
  onDeleteArticles: () => void;
};

export function DeletePanel({
  showDeleteAuthors,
  showDeleteArticles,
  selectedAuthorCount,
  selectedArticleCount,
  onChooseTarget,
  onDeleteAuthors,
  onDeleteArticles,
}: DeletePanelProps) {
  return (
    <section className="panel">
      <h2>Delete</h2>

      <div className="choice-row">
        <label>
          <input
            type="checkbox"
            checked={showDeleteAuthors}
            onChange={(event) => onChooseTarget('authors', event.target.checked)}
          />
          Authors
        </label>

        <label>
          <input
            type="checkbox"
            checked={showDeleteArticles}
            onChange={(event) => onChooseTarget('articles', event.target.checked)}
          />
          Articles
        </label>
      </div>

      {!showDeleteAuthors && !showDeleteArticles && (
        <p className="helper-text">Select Authors or Articles to show delete checkboxes in the lists.</p>
      )}

      <div className="delete-actions">
        {showDeleteAuthors && (
          <button
            className="danger"
            disabled={selectedAuthorCount === 0}
            onClick={onDeleteAuthors}
          >
            Delete Selected Authors
          </button>
        )}

        {showDeleteArticles && (
          <button
            className="danger"
            disabled={selectedArticleCount === 0}
            onClick={onDeleteArticles}
          >
            Delete Selected Articles
          </button>
        )}
      </div>
    </section>
  );
}
