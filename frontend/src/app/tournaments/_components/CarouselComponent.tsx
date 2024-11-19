import { Card, CardContent } from "@/components/ui/card"; // Card components for styling player cards
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel"; // Carousel components for horizontal scrolling
import React, { useState, useRef } from "react"; // React hooks
import Link from "next/link"; // Next.js Link for navigation
import type { Player } from "@/types/tournamentDetails"; // Player type definition
import TPlayer from "./TPlayer"; // Component for displaying player details

// Number of items to show per page in the carousel
const ITEMS_PER_PAGE = 16;

// Tournament type definition for the component props
interface Tournament {
	players: Player[];
}

// CarouselComponent
// Displays a carousel of players with pagination dots
const CarouselComponent = ({ tournament }: { tournament: Tournament }) => {
	// State for tracking the current page
	const [currentPage, setCurrentPage] = useState(0);

	// Ref for accessing the carousel container (if needed for future functionality)
	const carouselRef = useRef<HTMLDivElement>(null);

	// Calculate the total number of pages based on the number of players
	const totalPages = Math.ceil(tournament.players.length / ITEMS_PER_PAGE);

	// Handle pagination dot click
	const handleDotClick = (pageIndex: number) => {
		setCurrentPage(pageIndex); // Update the current page
	};

	// Calculate the range of items to display for the current page
	const startIndex = currentPage * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;

	// Slice the array of players to get only the players for the current page
	const currentItems = tournament.players.slice(startIndex, endIndex);

	return (
		<>
			{/* Carousel */}
			<Carousel
				ref={carouselRef}
				opts={{ align: "start" }} // Align items at the start
				className="p-6 pt-0 pb-12 h-max">

				{/* Carousel content */}
				<CarouselContent className="m-0">
					{/* Display players in a grid layout */}
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{currentItems.map((player, index) => {
							return (
								<Link
									href={`/players/${player.id}`} // Link to the player details page
									key={index}
									prefetch={true} // Prefetch player page for better performance
								>
									{/* Carousel item containing player card */}
									<CarouselItem className="m-0 p-0">
										<Card className="border-2 border-yellow-400 rounded-lg">
											<CardContent className="flex flex-col items-center justify-items-center py-4 px-3 text-center gap-1.5">
												{/* Player details */}
												<TPlayer player={player} />
											</CardContent>
										</Card>
									</CarouselItem>
								</Link>
							);
						})}
					</div>
				</CarouselContent>
			</Carousel>

			{/* Pagination dots */}
			<div className="absolute bottom-0 left-0 right-0 flex justify-center my-4">
				{/* Generate a button for each page */}
				{Array.from({ length: totalPages }).map((_, pageIndex) => (
					<button
						key={pageIndex}
						onClick={() => handleDotClick(pageIndex)} // Handle dot click
						className={`mx-1 w-2 h-2 rounded-full ${
							currentPage === pageIndex ? "bg-blue-300" : "bg-gray-300"
						}`}
					/>
				))}
			</div>
		</>
	);
};

export default CarouselComponent;
