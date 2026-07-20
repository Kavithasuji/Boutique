import type { KeyboardEvent } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

const SearchBar = ({
  value,
  onChange,
  onSearch,
}: SearchBarProps) => {
  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search by Order ID, Customer Name or Phone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-24 outline-none transition focus:border-black"
      />

      <button
        onClick={onSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-black px-4 py-1.5 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;