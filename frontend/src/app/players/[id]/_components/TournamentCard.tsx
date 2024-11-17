import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card"; // Importing Card, CardHeader, CardTitle, and CardDescription components from ui/card
import { tournamentResponse } from "@/api/tournaments/api"; // Importing tournamentResponse from tournaments api
import { useRouter } from "next/navigation"; // Importing useRouter from next/navigation for client-side navigation
import { useEffect, useState } from "react"; // Importing useEffect and useState from react for state management and side effects
import { fetchPlayer } from "@/api/users/api"; // Importing fetchPlayer and PlayerResponse from users api for fetching player data

// Defining the type for TournamentCardProps
type TournamentCardProps = {
	tournament: tournamentResponse;
};

// TournamentCard component definition
export default function TournamentCard({ tournament }: TournamentCardProps) {
	const router = useRouter(); // Using useRouter for client-side navigation
	const [winnerName, setWinnerName] = useState<string | null>(null); // State to hold the winner's name
	const { id, tournamentName, startDT, endDT, status, winner } = tournament; // Destructuring tournament properties

	useEffect(() => {
		const fetchWinner = async () => {
			// Async function to fetch the winner's name
			if (winner) {
				try {
					const player = await fetchPlayer(winner); // Fetching player data
					setWinnerName(player.fullname); // Updating winnerName state with the player's full name
				} catch (error) {
					console.error("Error fetching player:", error); // Logging error if fetching fails
				}
			}
		};
		fetchWinner(); // Calling the async function
	}, [winner]); // Dependency array to trigger the effect when winner changes

	const statusClass = (() => {
		// Function to determine the status class based on the tournament status
		switch (status) {
			case "Completed":
				return "text-green-500"; // Green for completed tournaments
			case "Ongoing":
			case "Matchmake":
				return "text-yellow-500"; // Yellow for ongoing or matchmake tournaments
			default:
				return "text-gray-500"; // Gray for all other statuses
		}
	})();

	const handleCardClick = () => {
		// Function to handle card click, navigating to the tournament details page
		router.push(`/tournaments/${id}`);
	};
	return (
		<Card onClick={handleCardClick} className="cursor-pointer">
			<CardHeader>
				<CardTitle>{tournamentName}</CardTitle> // Displaying tournament name
				<CardDescription>
					{startDT} - {endDT} // Displaying tournament dates
				</CardDescription>
				<CardDescription className={statusClass}>{status}</CardDescription> //
				Displaying tournament status with dynamic class
				{winnerName && (
					<CardDescription>Winner: {winnerName}</CardDescription>
				)}{" "}
				// Displaying winner's name if available
			</CardHeader>
		</Card>
	);
}
