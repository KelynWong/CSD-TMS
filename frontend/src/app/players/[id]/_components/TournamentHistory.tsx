"use client";
import React, { useState, useEffect } from "react";
import TournamentCard from "./TournamentCard";
import Paginator from "./Paginator";

type Tournament = {
	id: number;
	name: string;
	start_date: string;
	end_date: string;
	status: string;
	result: string;
};

export default function TournamentHistory({
	tournaments,
}: {
	tournaments: Tournament[];
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
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
				{currentTournaments.map((tournament, index) => (
					<TournamentCard key={index} {...tournament} />
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
	);
}
