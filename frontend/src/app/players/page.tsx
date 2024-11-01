"use client";

import { PlayerCard } from "./_components/PlayerCard";
import { PlayerCardProps } from "@/types/player";
import { fetchUserByRoles } from "@/api/users/api";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Paginator from "@/components/Paginator";
import { PlayerResponse } from "@/api/users/api";
import { useNavBarContext } from "@/context/navBarContext";
import SearchBar from "@/components/Search";

export default function Players() {
	const [PlayerCardProps, setPlayerCardProps] = useState<PlayerCardProps[]>([]);
	const [loading, setLoading] = useState(true);

	// Set navbar context
	const { setState } = useNavBarContext();
	setState("players");

	// set search term
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (searchTerm: string) => {
		setSearchTerm(searchTerm);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchUserByRoles("Player");
				const mappedData: PlayerCardProps[] = (data as PlayerResponse[]).map(
					(player: PlayerResponse) => ({
						id: player.id,
						username: player.username,
						fullname: player.fullname,
						gender: player.gender,
						profilePicture: player.profilePicture,
					})
				);
				setPlayerCardProps(mappedData);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch players:", error);
				setLoading(false);
			}
		};
		fetchData();
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

    const FilteredPlayers = PlayerCardProps.filter(player => player.fullname.toLowerCase().includes(searchTerm.toLowerCase()));

	const totalPages = Math.ceil(FilteredPlayers.length / itemsPerPage);


	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};


	const currentPlayers = FilteredPlayers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	if (loading) {
		return <Loading />;
	}

	if (currentPlayers.length === 0) {
		return <div>Error: No players found.</div>;
	}

	return (
		<div className="container mx-auto px-4 py-10">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Players</h1>
				<SearchBar onSearch={(term) => handleSearch(term)} />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{FilteredPlayers.map((player) => (
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
