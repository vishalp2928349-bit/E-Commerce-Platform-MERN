export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40"
      >
        Prev
      </button>
      {pageNumbers.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`w-8 h-8 rounded-lg text-sm ${
            n === page ? "bg-primary text-white" : "border text-gray-600 hover:bg-gray-100"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
