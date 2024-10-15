import { tournamentResponse } from "@/api/tournaments/api";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";

export default function TournamentCard({ tournament }: tournamentResponse) {
	console.log("TournamentCard component rendered");
	console.log("Tournament Name:", tournament.tournamentName);
	console.log("Start Date:", tournament.startDT);
	console.log("End Date:", tournament.endDT);
	console.log("Status:", tournament.status);
	console.log("Registration Start Date:", tournament.regStartDT);
	console.log("Registration End Date:", tournament.regEndDT);
	console.log("Winner:", tournament.winner);

	const result = "win";
	const statusClass =
		tournament.status === "In Progress" ? "text-yellow-500" : "text-gray-500";

	return (
		<Card>
			<CardHeader>
				<CardTitle>{tournament.tournamentName}</CardTitle>
				<CardDescription>
					{tournament.startDT} - {tournament.endDT}
				</CardDescription>
				<CardDescription className={statusClass}>
					{tournament.status}
				</CardDescription>
				<CardDescription>{result}</CardDescription>
			</CardHeader>
		</Card>
	);
}
