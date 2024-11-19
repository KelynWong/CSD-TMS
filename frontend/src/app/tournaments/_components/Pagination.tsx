import { PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationContent } from "@/components/ui/pagination"; // Importing UI components for pagination

// Props definition for the Pagination component
interface PaginationProps {
  currentPage: number; // Current active page
  totalPages: number; // Total number of pages
  onPageChange: (page: number) => void; // Callback to handle page changes
}

// Pagination Component
// Provides navigation for multiple pages, including "Previous", "Next", and page number links
const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  return (
    <div className="mt-10 flex justify-end">
      {/* Pagination container */}
      <PaginationContent>
        {/* "Previous" button */}
        <PaginationItem>
          <PaginationPrevious
            className={`text-base ${
              currentPage === 1 ? "text-gray-400 pointer-events-none" : "" // Disable button if on the first page
            }`}
            href="#" // Placeholder href for styling, should be replaced if using anchor navigation
            onClick={
              currentPage > 1 
              ? () => onPageChange(currentPage - 1) // Go to the previous page if not on the first page
              : undefined
            }
          >
            Previous
          </PaginationPrevious>
        </PaginationItem>

        {/* Page number buttons */}
        {Array.from({ length: totalPages }, (_, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              className={`text-base ${
                currentPage === index + 1 
                ? "font-bold text-black" // Highlight the active page
                : "text-slate-300" // Style inactive pages
              }`}
              href="#" // Placeholder href for styling
              onClick={() => onPageChange(index + 1)} // Change to the clicked page
            >
              {index + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* "Next" button */}
        <PaginationItem>
          <PaginationNext
            className={`text-base ${
              currentPage === totalPages 
              ? "text-gray-400 pointer-events-none" // Disable button if on the last page
              : ""
            }`}
            href="#" // Placeholder href for styling
            onClick={
              currentPage < totalPages 
              ? () => onPageChange(currentPage + 1)  // Go to the next page if not on the last page
              : undefined
            }
          >
            Next
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </div>
  );
};

export default Pagination;