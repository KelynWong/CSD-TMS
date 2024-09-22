import PlayerHero from "@/components/PlayerHero";
import { Player } from "@/types/player";
import { Match } from "@/types/match";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";

export default function PlayerProfile({ params }: { params: { id: string } }) {
	const player: Player = {
		id: 1,
		username: "KaiXuan",
		fullname: "Kai Xuan",
		gender: "Male",
		ranking: 1,
		rating: 103,
		wins: 9,
		losses: 1,
		win_rate: 90,
	};

	const MatchHistory: Match[] = [
		{
			set_number: 1,
			tournament_id: 1,
			tournament_name: "Singapore Open",
			opponent: "John Doe",
			opponent_id: 1,
			result: "Win",
			round: 1,
			final_score: "11-9",
			datetime: new Date("2024-01-01 10:00:00").toLocaleDateString(),
		},
		{
			set_number: 2,
			tournament_id: 1,
			tournament_name: "Singapore Open",
			opponent: "John Doe",
			opponent_id: 1,
			result: "Win",
			round: 1,
			final_score: "11-9",
			datetime: new Date("2024-01-01 11:00:00").toLocaleDateString(),
		},
		{
			set_number: 3,
			tournament_id: 1,
			tournament_name: "Singapore Open",
			opponent: "John Doe",
			opponent_id: 1,
			result: "Win",
			round: 1,
			final_score: "11-9",
			datetime: new Date("2024-01-01 12:00:00").toLocaleDateString(),
		},
		{
			set_number: 4,
			tournament_id: 1,
			tournament_name: "Singapore Open",
			opponent: "John Doe",
			opponent_id: 2,
			result: "Loss",
			round: 1,
			final_score: "9-11",
			datetime: new Date("2024-01-01 13:00:00").toLocaleDateString(),
		},
	];
	return (
		<>
			<div>
				<PlayerHero {...player} />
			</div>
			<div className="container mx-auto py-5 px-5">
				<p className="text-4xl font-bold pb-3">Match History</p>
				<DataTable columns={columns} data={MatchHistory} />
			</div>
			<div className="container mx-auto py-5 px-5">
				<p className="text-4xl font-bold pb-3">Tournament History</p>
			</div>
		</>
	);
}
