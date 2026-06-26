import type { Mode } from '../types';

type ToolbarProps = {
  mode: Mode;
  onCreate: () => void;
  onDelete: () => void;
  onRefresh: () => void;
};

export function Toolbar({ mode, onCreate, onDelete, onRefresh }: ToolbarProps) {
  return (
    <section className="toolbar">
      <button className={mode === 'create' ? 'active' : ''} onClick={onCreate}>
        Create
      </button>

      <button
        className={mode === 'delete' ? 'danger active' : 'danger'}
        onClick={onDelete}
      >
        Delete
      </button>

      <button className="secondary" onClick={onRefresh}>
        Refresh
      </button>
    </section>
  );
}
