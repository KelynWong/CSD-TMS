import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { tournamentResponse } from "@/api/tournaments/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPlayer, PlayerResponse } from "@/api/users/api";

type TournamentCardProps = {
	tournament: tournamentResponse;
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
	const router = useRouter();
	const [winnerName, setWinnerName] = useState<string | null>(null);
	const {
		id,
		tournamentName,
		startDT,
		endDT,
		status,
		regStartDT,
		regEndDT,
		winner,
	} = tournament;

	useEffect(() => {
		const fetchWinner = async () => {
			// Added async function
			if (winner) {
				try {
					const player = await fetchPlayer(winner);
					setWinnerName(player.fullname); // Changed to const
				} catch (error) {
					console.error("Error fetching player:", error);
				}
			}
		};
		fetchWinner(); // Call the async function
	}, [winner]); // Added dependency array

	const statusClass = (() => {
		switch (status) {
			case "Completed":
				return "text-green-500";
			case "Ongoing":
			case "Matchmake":
				return "text-yellow-500";
			default:
				return "text-gray-500"; // For all other statuses
		}
	})();

	const handleCardClick = () => {
		router.push(`/tournaments/${id}`);
	};
	return (
		<Card onClick={handleCardClick} className="cursor-pointer">
			<CardHeader>
				<CardTitle>{tournamentName}</CardTitle>
				<CardDescription>
					{startDT} - {endDT}
				</CardDescription>
				<CardDescription className={statusClass}>{status}</CardDescription>
				{winnerName && <CardDescription>Winner: {winnerName}</CardDescription>}
			</CardHeader>
		</Card>
	);
}
