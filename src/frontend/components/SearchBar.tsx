type SearchBarProps = {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
};

export function SearchBar({
  searchText,
  onSearchTextChange,
  onSearch,
  onClear,
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <input
        value={searchText}
        onChange={(event) => onSearchTextChange(event.target.value)}
        placeholder="Search authors or articles by keyword"
      />

      <button onClick={onSearch}>Search</button>

      <button className="secondary" onClick={onClear}>
        Clear
      </button>
    </div>
  );
}
