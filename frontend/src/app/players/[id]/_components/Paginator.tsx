import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

export default function Paginator({
	totalPages,
	currentPage,
	onPageChange,
}: {
	totalPages: number;
	currentPage: number;
	onPageChange: (page: number) => void;
}) {
	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
		}
	};

	const handlePageClick = (page: number) => {
		onPageChange(page);
	};

	const renderPageNumbers = () => {
		const pages = [];
		for (let i = 1; i <= totalPages; i++) {
			pages.push(
				<PaginationItem key={i}>
					<PaginationLink
						onClick={() => handlePageClick(i)}
						isActive={i === currentPage}
					>
						{i}
					</PaginationLink>
				</PaginationItem>
			);
		}

		return pages;
	};


	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious onClick={handlePrevious} />
				</PaginationItem>
				{renderPageNumbers()}
				<PaginationItem>
					<PaginationNext onClick={handleNext} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
