import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { tournamentResponse } from "@/api/tournaments/api";
import { useRouter } from "next/navigation";

type TournamentCardProps = {
	tournament: tournamentResponse;
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
	const router = useRouter();
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
	const statusClass =
		status === "Ongoing" ? "text-yellow-500" : "text-gray-500";

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
				<CardDescription>Winner: {winner}</CardDescription>
			</CardHeader>
		</Card>
	);
}
