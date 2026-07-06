type CreatePanelProps = {
  showCreateAuthor: boolean;
  showCreateArticle: boolean;
  onChooseTarget: (target: 'author' | 'article', checked: boolean) => void;
};

export function CreatePanel({
  showCreateAuthor,
  showCreateArticle,
  onChooseTarget,
}: CreatePanelProps) {
  return (
    <section className="panel">
      <h2>Create</h2>

      <div className="choice-row">
        <label>
          <input
            type="checkbox"
            checked={showCreateAuthor}
            onChange={(event) => onChooseTarget('author', event.target.checked)}
          />
          Author
        </label>

        <label>
          <input
            type="checkbox"
            checked={showCreateArticle}
            onChange={(event) => onChooseTarget('article', event.target.checked)}
          />
          Article
        </label>
      </div>

      {!showCreateAuthor && !showCreateArticle && (
        <p className="helper-text">Select Author or Article to open a create form.</p>
      )}
    </section>
  );
}
