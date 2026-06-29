import type { Article } from '../types';

type ArticleCardProps = {
  article: Article;
  showDeleteCheckbox: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: () => void;
};

export function ArticleCard({
  article,
  showDeleteCheckbox,
  isSelected,
  onSelect,
  onUpdate,
}: ArticleCardProps) {
  return (
    <article className="result-card">
      {showDeleteCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onClick={(event) => event.stopPropagation()}
          onChange={onSelect}
        />
      )}

      <h3>{article.headline}</h3>
      <p>{article.content}</p>

      <p className="meta">
        Author: {article.author.firstName} {article.author.lastName} ·{' '}
        {article.author.email}
      </p>

      <div className="card-actions">
        <button onClick={onUpdate}>Update Article</button>
      </div>
    </article>
  );
}
