import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

// Define the Paginator component
export default function Paginator({
	totalPages,
	currentPage,
	onPageChange,
}: {
	totalPages: number; // Total number of pages
	currentPage: number; // Current page number
	onPageChange: (page: number) => void; // Function to call when page changes
}) {
	// Function to handle previous page click
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1); // Go to the previous page
		}
	};

	// Function to handle next page click
	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1); // Go to the next page
		}
	};

	// Function to handle page number click
	const handlePageClick = (page: number) => {
		onPageChange(page); // Go to the selected page
	};

	// Function to render page numbers
	const renderPageNumbers = () => {
		const pages = []; // Array to hold page numbers
		for (let i = 1; i <= totalPages; i++) {
			pages.push(
				<PaginationItem key={i}>
					<PaginationLink
						onClick={() => handlePageClick(i)} // Handle click on page number
						isActive={i === currentPage} // Highlight the current page
					>
						{i} {/* Display the page number */}
					</PaginationLink>
				</PaginationItem>
			);
		}

		return pages; // Return the array of page numbers
	};

	// Render the Paginator component
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious onClick={handlePrevious} /> {/* Previous page button */}
				</PaginationItem>
				{renderPageNumbers()} {/* Render page numbers */}
				<PaginationItem>
					<PaginationNext onClick={handleNext} /> {/* Next page button */}
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
