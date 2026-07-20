interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: PaginationProps) => {
  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <p className="text-sm text-gray-600">
        Page{" "}
        <span className="font-semibold">
          {currentPage}
        </span>{" "}
        of{" "}
        <span className="font-semibold">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevious}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNext}
          className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;