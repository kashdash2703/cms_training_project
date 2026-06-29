import type { Author, Mode } from '../types';
import { AuthorCard } from './AuthorCard';

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
        <AuthorCard
          key={author.id}
          author={author}
          showDeleteCheckbox={mode === 'delete' && showDeleteAuthors}
          isSelected={selectedAuthorIds.includes(author.id)}
          onSelect={() => onToggleAuthorSelection(author.id)}
          onUpdate={() => onStartUpdateAuthor(author)}
          onClick={() => onShowArticlesByAuthor(author)}
        />
      ))}
    </section>
  );
}
