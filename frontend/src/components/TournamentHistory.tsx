"use client";
import React, { useState, useEffect } from "react";
import TournamentCard from "@/components/TournamentCard";
import Paginator from "@/components/Paginator";
import { tournamentResponse } from "@/api/tournaments/api";

export default function TournamentHistory({
	tournaments,
}: {
	tournaments: tournamentResponse[];
}) {
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(8);

	useEffect(() => {
		const handleResize = () => {
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

	const totalPages = Math.ceil(tournaments.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const currentTournaments = tournaments.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	return (
		<>
			<p className="text-4xl font-bold pb-3">Tournament History</p>
			{tournaments.length === 0 ? (
				<p className="text-xl">No tournaments available.</p>
			) : (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{currentTournaments.map((tournament, index) => (
							<TournamentCard
								key={index}
								tournament={tournament}
							/>
						))}
					</div>
					<div className="flex justify-center mt-5">
						<Paginator
							totalPages={totalPages}
							currentPage={currentPage}
							onPageChange={handlePageChange}
						/>
					</div>
				</>
			)}
		</>
	);
}
