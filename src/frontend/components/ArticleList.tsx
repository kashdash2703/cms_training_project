import type { Article, Mode } from '../types';

type ArticleListProps = {
  articles: Article[];
  mode: Mode;
  showDeleteArticles: boolean;
  selectedArticleIds: string[];
  onToggleArticleSelection: (id: string) => void;
  onStartUpdateArticle: (article: Article) => void;
};

export function ArticleList({
  articles,
  mode,
  showDeleteArticles,
  selectedArticleIds,
  onToggleArticleSelection,
  onStartUpdateArticle,
}: ArticleListProps) {
  return (
    <section>
      <h2>Articles</h2>

      {articles.length === 0 && <p className="empty">No articles found.</p>}

      {articles.map((article) => (
        <article key={article.id} className="result-card">
          {mode === 'delete' && showDeleteArticles && (
            <input
              type="checkbox"
              checked={selectedArticleIds.includes(article.id)}
              onClick={(event) => event.stopPropagation()}
              onChange={() => onToggleArticleSelection(article.id)}
            />
          )}

          <h3>{article.headline}</h3>
          <p>{article.content}</p>

          <p className="meta">
            Author: {article.author.firstName} {article.author.lastName} ·{' '}
            {article.author.email}
          </p>

          <div className="card-actions">
            <button onClick={() => onStartUpdateArticle(article)}>
              Update Article
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
