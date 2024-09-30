import { PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationContent } from "@/components/ui/pagination";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="mt-10 flex justify-end">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`text-base ${currentPage === 1 ? "text-gray-200 pointer-events-none" : ""}`}
            href="#"
            onClick={currentPage > 1 ? () => onPageChange(currentPage - 1) : undefined}
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              className={`text-base ${currentPage === index + 1 ? "font-bold text-black" : "text-zinc-400"}`}
              href="#"
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            className={`text-base ${currentPage === totalPages ? "text-gray-200 pointer-events-none" : ""}`}
            href="#"
            onClick={currentPage < totalPages ? () => onPageChange(currentPage + 1) : undefined}
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </div>
  );
};

export default Pagination;