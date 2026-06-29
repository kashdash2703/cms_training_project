import type { Article, Mode } from '../types';
import { ArticleCard } from './ArticleCard';

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
        <ArticleCard
          key={article.id}
          article={article}
          showDeleteCheckbox={mode === 'delete' && showDeleteArticles}
          isSelected={selectedArticleIds.includes(article.id)}
          onSelect={() => onToggleArticleSelection(article.id)}
          onUpdate={() => onStartUpdateArticle(article)}
        />
      ))}
    </section>
  );
}
