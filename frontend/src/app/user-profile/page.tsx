"use client";
import PlayerHero from "@/components/PlayerHero";
import { Player } from "@/types/player";
import { Match } from "@/types/match";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";
import TournamentHistory from "@/components/TournamentHistory";
import { formatDate } from "@/utils/dateFormatter";
import { useState, useEffect } from "react";
import { fetchPlayer } from "@/api/users/api";
import Loading from "@/components/Loading";
import { useUserContext } from "@/context/userContext";
import { fetchPlayerStats } from "@/api/matches/api";
import {
	fetchTournamentByPlayerId,
	tournamentResponse,
} from "@/api/tournaments/api";

export default function UserProfile() {
	const { user } = useUserContext();
	const [player, setPlayer] = useState<Player | null>(null);
	const [tournaments, setTournaments] = useState<tournamentResponse[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (user) {
			console.log(user);
			const getPlayerData = async () => {
				try {
					const data = await fetchPlayer(user.id);
					const stats = await fetchPlayerStats(user.id);
					const tournaments = await fetchTournamentByPlayerId(
						user.id
					);
					setLoading(false);
					const mappedData: Player = {
						id: user.id,
						username: user.username,
						fullname: user.fullName,
						gender: user.gender,
						ranking: 1, // TODO: Implement ranking
						rating: data.rating ? data.rating : 0,
						wins: stats.wins ? stats.wins : 0,
						losses: stats.losses ? stats.losses : 0,
						total_matches: stats.gamesPlayed
							? stats.gamesPlayed
							: 0,
						profilePicture: user.imageUrl,
						country: user.publicMetadata.country,
					};

					const tournamentHistory = tournaments.map((tournament) => ({
						id: tournament.id,
						tournamentName: tournament.tournamentName,
						startDT: formatDate(new Date(tournament.startDT)),
						endDT: formatDate(new Date(tournament.endDT)),
						status: tournament.status,
						regStartDT: formatDate(new Date(tournament.regStartDT)),
						regEndDT: formatDate(new Date(tournament.regEndDT)),
						winner: tournament.winner,
					}));
					setTournaments(tournamentHistory);
					setPlayer(mappedData);
				} catch (err) {
					console.error("Failed to fetch player:", err);
				}
			};
			getPlayerData();
		}
	}, [user]);

	if (loading) {
		return <Loading />;
	}

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
			datetime: formatDate(new Date("2024-01-01 10:00:00")),
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
			datetime: formatDate(new Date("2024-01-01 11:00:00")),
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
			datetime: formatDate(new Date("2024-01-01 12:00:00")),
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
			datetime: formatDate(new Date("2024-01-01 13:00:00")),
		},
	];

	return (
		<>
			<div>{player ? <PlayerHero player={player} /> : <Loading />}</div>
			<div className="container mx-auto py-5 px-5">
				<p className="text-4xl font-bold pb-3">Match History</p>
				<DataTable columns={columns} data={MatchHistory} />
			</div>
			<div className="container mx-auto py-5 px-5">
				{tournaments.length > 0 ? (
					<TournamentHistory tournaments={tournaments} />
				) : (
					<div className="flex justify-center">
						<p className="text-xl">No tournaments available.</p>
					</div>
				)}
			</div>
		</>
	);
}
