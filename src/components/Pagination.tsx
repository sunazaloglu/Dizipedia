import { Pagination as BootstrapPagination } from "react-bootstrap";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (delta: number) => void;
  totalItems: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
}: PaginationProps) {
  if (totalItems === 0) return null;

  return (
    <div className="d-flex flex-column align-items-center mt-3  ">
      <BootstrapPagination className="pagination-success" size="lg">
        <BootstrapPagination.Prev
          onClick={() => onPageChange(-1)}
          disabled={currentPage <= 1}
        />

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNumber;
          if (totalPages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
          } else if (currentPage >= totalPages - 2) {
            pageNumber = totalPages - 4 + i;
          } else {
            pageNumber = currentPage - 2 + i;
          }

          return (
            <BootstrapPagination.Item
              key={pageNumber}
              active={pageNumber === currentPage}
              onClick={() => onPageChange(pageNumber - currentPage)}
            >
              {pageNumber}
            </BootstrapPagination.Item>
          );
        })}

        <BootstrapPagination.Next
          onClick={() => onPageChange(1)}
          disabled={currentPage >= totalPages}
        />
      </BootstrapPagination>

      <div className="mt-2 text-muted">
        <small>
          Page {currentPage} of {totalPages} (Total {totalItems} series)
        </small>
      </div>
    </div>
  );
}
