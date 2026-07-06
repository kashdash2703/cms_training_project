import type { Article, Author } from '../types';

type AuthorArticleViewProps = {
  author: Author;
  articles: Article[];
};

export function AuthorArticleView({ author, articles }: AuthorArticleViewProps) {
  return (
    <section className="panel">
      <h2>
        Articles by {author.firstName} {author.lastName}
      </h2>

      {articles.length === 0 && (
        <p className="empty">No articles found for this author.</p>
      )}

      {articles.map((article) => (
        <article key={article.id} className="result-card">
          <h3>{article.headline}</h3>
          <p>{article.content}</p>
        </article>
      ))}
    </section>
  );
}
