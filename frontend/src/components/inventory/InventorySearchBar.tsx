interface InventorySearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const InventorySearchBar = ({
  value,
  onChange,
  onSearch,
}: InventorySearchBarProps) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        placeholder="Search by product or SKU..."
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSearch();
          }
        }}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />

      <button
        onClick={onSearch}
        className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default InventorySearchBar;