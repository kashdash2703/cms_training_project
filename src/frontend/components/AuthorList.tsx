import type { Author, Mode } from '../types';

type AuthorListProps = {
  authors: Author[];
  mode: Mode;
  showDeleteAuthors: boolean;
  selectedAuthorIds: string[];
  onToggleAuthorSelection: (id: string) => void;
  onStartUpdateAuthor: (author: Author) => void;
  onShowArticlesByAuthor: (author: Author) => void;
};

export function AuthorList({
  authors,
  mode,
  showDeleteAuthors,
  selectedAuthorIds,
  onToggleAuthorSelection,
  onStartUpdateAuthor,
  onShowArticlesByAuthor,
}: AuthorListProps) {
  return (
    <section>
      <h2>Authors</h2>

      {authors.length === 0 && <p className="empty">No authors found.</p>}

      {authors.map((author) => (
        <article
          key={author.id}
          className="result-card author-card clickable-card"
          role="button"
          tabIndex={0}
          onClick={() => onShowArticlesByAuthor(author)}
          onKeyDown={(event) => {
            if (event.target !== event.currentTarget) {
              return;
            }

            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onShowArticlesByAuthor(author);
            }
          }}
        >
          {mode === 'delete' && showDeleteAuthors && (
            <input
              type="checkbox"
              checked={selectedAuthorIds.includes(author.id)}
              onClick={(event) => event.stopPropagation()}
              onChange={() => onToggleAuthorSelection(author.id)}
            />
          )}

          <h3>
            {author.firstName} {author.lastName}
          </h3>

          <p>{author.email}</p>

          <div className="card-actions">
            <button
              onClick={(event) => {
                event.stopPropagation();
                onStartUpdateAuthor(author);
              }}
            >
              Update Author
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
