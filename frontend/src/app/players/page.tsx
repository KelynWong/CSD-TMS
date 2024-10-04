"use client";

import { PlayerCard } from "./_components/PlayerCard";
import { PlayerCardProps } from "@/types/player";
import { AdminResponse, fetchUserByRoles } from "@/api/users/api";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Paginator from "@/components/Paginator";
import { PlayerResponse } from "@/api/users/api";

export default function Players() {
	const [PlayerCardProps, setPlayerCardProps] = useState<PlayerCardProps[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		fetchUserByRoles("Player").then(
			(data: PlayerResponse[] | AdminResponse[]) => {
				setLoading(false);
				const mappedData: PlayerCardProps[] = (data as PlayerResponse[]).map(
					(player: PlayerResponse) => {
						return {
							id: player.id,
							username: player.username,
							fullname: player.fullname,
							gender: player.gender,
							profilePicture: player.profilePicture,
						};
					}
				);
				setPlayerCardProps(mappedData);
			}
		);
	}, []);

	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(30);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) {
				setItemsPerPage(10);
			} else if (window.innerWidth < 1024) {
				setItemsPerPage(20);
			} else {
				setItemsPerPage(30);
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const totalPages = Math.ceil(PlayerCardProps.length / itemsPerPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const currentPlayers = PlayerCardProps.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	if (loading) {
		return <Loading />;
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Players</h1>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{currentPlayers.map((player) => (
					<PlayerCard key={player.id} player={player} />
				))}
			</div>
			<div className="flex justify-center mt-5">
				<Paginator
					totalPages={totalPages}
					currentPage={currentPage}
					onPageChange={handlePageChange}
				/>
			</div>
		</div>
	);
}
