"use client";

import { PlayerCard } from "./_components/PlayerCard"; // Import PlayerCard component from local directory
import { PlayerCardProps } from "@/types/player"; // Import PlayerCardProps from types/player
import { fetchUserByRoles } from "@/api/users/api"; // Import fetchUserByRoles from users api
import { useEffect, useState } from "react"; // Import useEffect and useState from react
import Loading from "@/components/Loading"; // Import Loading component from components
import Paginator from "@/components/Paginator"; // Import Paginator component from components
import { PlayerResponse } from "@/api/users/api"; // Import PlayerResponse from users api
import { useNavBarContext } from "@/context/navBarContext"; // Import useNavBarContext from navBarContext
import SearchBar from "@/components/Search"; // Import SearchBar component from components

export default function Players() {
	const [PlayerCardProps, setPlayerCardProps] = useState<PlayerCardProps[]>([]); // State to hold player card props
	const [loading, setLoading] = useState(true); // State to manage loading status
	const [error, setError] = useState<string | null>(null); // State to manage error message

	// Set navbar context to 'players'
	const { setState } = useNavBarContext();
	setState("players");

	// State to manage search term
	const [searchTerm, setSearchTerm] = useState("");

	// Function to handle search input
	const handleSearch = (searchTerm: string) => {
		setSearchTerm(searchTerm);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchUserByRoles("Player"); // Fetch players by role
				const mappedData: PlayerCardProps[] = (data as PlayerResponse[]).map(
					(player: PlayerResponse) => ({
						id: player.id,
						username: player.username,
						fullname: player.fullname,
						gender: player.gender,
						profilePicture: player.profilePicture,
					})
				);
				setPlayerCardProps(mappedData); // Update player card props state
			} catch (error) {
				console.error("Failed to fetch players:", error); // Log error if fetching fails
				setError("No Players Found."); // Set error message
			} finally {
                setLoading(false); // Set loading to false after fetching
            }
		};
		fetchData(); // Call fetchData function
	}, []);

	const [currentPage, setCurrentPage] = useState(1); // State to manage current page
	const [itemsPerPage, setItemsPerPage] = useState(30); // State to manage items per page

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) {
				setItemsPerPage(10); // Adjust items per page for small screens
			} else if (window.innerWidth < 1024) {
				setItemsPerPage(20); // Adjust items per page for medium screens
			} else {
				setItemsPerPage(30); // Adjust items per page for large screens
			}
		};

		handleResize(); // Call handleResize function
		window.addEventListener("resize", handleResize); // Listen for window resize event

		return () => window.removeEventListener("resize", handleResize); // Cleanup event listener
	}, []);

    const FilteredPlayers = PlayerCardProps.filter(player => player.fullname.toLowerCase().includes(searchTerm.toLowerCase())); // Filter players based on search term

	const totalPages = Math.ceil(FilteredPlayers.length / itemsPerPage); // Calculate total pages

	const handlePageChange = (page: number) => {
		setCurrentPage(page); // Update current page state
	};

	const currentPlayers = FilteredPlayers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	); // Calculate current players to display

	if (loading) {
		return <Loading />; // Display loading component if loading
	}

	if (error) {
		return (
			<div className="w-[80%] h-full mx-auto py-16">
				<div className="flex flex-col items-center justify-center h-full">
					<img src="/images/error.png" className="size-72" alt="No Players Found" />
					<h1 className="text-2xl font-bold text-center mt-8 text-red-500">{error}</h1>
				</div>
			</div>
		);
	}

	if (currentPlayers.length === 0) {
		return (
			<div className="container mx-auto px-4 py-10">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Players</h1>
					<SearchBar onSearch={(term) => handleSearch(term)} />
				</div>
				<div className="w-[80%] h-full mx-auto py-16">
					<div className="flex flex-col items-center justify-center h-full">
						<img src="/images/no_ongoing.png" className="size-72" alt="No Players Found" />
						<h1 className="text-2xl font-bold text-center mt-8 text-red-500">No players found.</h1>
					</div>
				</div>
			</div>
		);
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
