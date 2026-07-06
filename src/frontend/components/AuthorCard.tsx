import type { Author } from '../types';

type AuthorCardProps = {
  author: Author;
  showDeleteCheckbox: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: () => void;
  onClick: () => void;
};

export function AuthorCard({
  author,
  showDeleteCheckbox,
  isSelected,
  onSelect,
  onUpdate,
  onClick,
}: AuthorCardProps) {
  return (
    <article
      className="result-card author-card clickable-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
    >
      {showDeleteCheckbox && (
        <input
          type="checkbox"
          checked={isSelected}
          onClick={(event) => event.stopPropagation()}
          onChange={onSelect}
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
            onUpdate();
          }}
        >
          Update Author
        </button>
      </div>
    </article>
  );
}
