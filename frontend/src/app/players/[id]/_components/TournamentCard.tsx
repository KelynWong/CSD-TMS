import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { tournamentResponse } from "@/api/tournaments/api";

type TournamentCardProps = {
	tournament: tournamentResponse;
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
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

	return (
		<Card>
			<CardHeader>
				<CardTitle>{tournamentName}</CardTitle>
				<CardDescription>
					{startDT} - {endDT}
				</CardDescription>
				<CardDescription className={statusClass}>{status}</CardDescription>
				<CardDescription>{winner}</CardDescription>
			</CardHeader>
		</Card>
	);
}
