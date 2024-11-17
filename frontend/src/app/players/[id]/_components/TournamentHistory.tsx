"use client";
import React, { useState, useEffect } from "react";
import TournamentCard from "./TournamentCard"; // Import TournamentCard component for displaying tournament information
import Paginator from "./Paginator"; // Import Paginator component for pagination

import { tournamentResponse } from "@/api/tournaments/api"; // Import tournamentResponse from tournaments api for tournament data type

// TournamentHistory component definition
export default function TournamentHistory({
	tournaments,
}: {
	tournaments: tournamentResponse[]; // Array of tournament responses
}) {
	const [currentPage, setCurrentPage] = useState(1); // State to manage the current page number
	const [itemsPerPage, setItemsPerPage] = useState(8); // State to manage the number of items per page

	useEffect(() => {
		const handleResize = () => {
			// Adjust items per page based on window width for responsive design
			if (window.innerWidth < 640) {
				setItemsPerPage(4);
			} else if (window.innerWidth < 1024) {
				setItemsPerPage(6);
			} else {
				setItemsPerPage(8);
			}
		};

		handleResize(); // Set initial value
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const totalPages = Math.ceil(tournaments.length / itemsPerPage); // Calculate total pages based on tournaments length and items per page

	const handlePageChange = (page: number) => {
		setCurrentPage(page); // Update current page state when page changes
	};

	const currentTournaments = tournaments.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	); // Calculate the current tournaments to display based on current page and items per page

	return (
		<>
			<p className="text-4xl font-bold pb-3">Tournament History</p> // Display tournament history title
			{tournaments.length === 0 ? (
				<p className="text-xl">No tournaments available.</p> // Display message if no tournaments are available
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{currentTournaments.map((tournament, index) => (
							<TournamentCard
								key={index}
								tournament={tournament}
							/>
						))} // Map and display current tournaments
					</div>
					<div className="flex justify-center mt-5">
						<Paginator
							totalPages={totalPages}
							currentPage={currentPage}
							onPageChange={handlePageChange}
						/> // Display paginator for navigation
					</div>
				</>
			)}
		</>
	);
}
