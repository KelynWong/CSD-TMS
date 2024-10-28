"use client";
import PlayerHero from "@/components/PlayerHero";
import { Player } from "@/types/player";
import { Match } from "@/types/match";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";
import TournamentHistory from "@/components/TournamentHistory";
import { formatDate } from "@/utils/dateFormatter";
import { useState, useEffect } from "react";
import { fetchPlayer, getPlayerRank, PlayerResponse } from "@/api/users/api";
import Loading from "@/components/Loading";
import { useUserContext } from "@/context/userContext";
import { fetchPlayerMatches, fetchPlayerStats } from "@/api/matches/api";
import {
	fetchTournamentByPlayerId,
	tournamentResponse,
} from "@/api/tournaments/api";
import { useNavBarContext } from "@/context/navBarContext";

export default function UserProfile() {
	// Set navbar context
	const { setState } = useNavBarContext();
	setState("profile");

	const { user } = useUserContext();
	const [player, setPlayer] = useState<Player | null>(null);
	const [tournaments, setTournaments] = useState<tournamentResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [gameHistory, setGameHistory] = useState([]);

	useEffect(() => {
		if (user) {
			const getPlayerData = async () => {
				try {
					const [data, stats, tournaments, matches, rank] =
						await Promise.all([
							fetchPlayer(user.id),
							fetchPlayerStats(user.id),
							fetchTournamentByPlayerId(user.id),
							fetchPlayerMatches(user.id),
							getPlayerRank(user.id),
						]);
					setLoading(false);
					const mappedData: Player = {
						id: user.id,
						username: user.username,
						fullname: user.fullName,
						gender: user.gender,
						ranking: rank,
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

					// get the match history
					const matchHistory = matches.map((match) => ({
						match_id: match.id,
						winner_id: match.winnerId,
						tournament_id: match.tournamentId,
						player1Id: match.player1Id,
						player2Id: match.player2Id,
						games: match.games,
						roundNum: match.roundNum,
					}));

					// collect all the opponent id
					const opponentIds = new Set();
					matchHistory.forEach((match) => {
						const opponentId =
							user.id === match.player1Id
								? match.player2Id
								: match.player1Id;
						opponentIds.add(opponentId);
					});

					// fetch all the opponents' data in one go
					const opponentData: PlayerResponse[] = await Promise.all(
						Array.from(opponentIds).map((id) => fetchPlayer(id))
					);

					// create a map of opponent Ids to their names
					const opponentMap = new Map<string, string>();
					opponentData.forEach((opponent) => {
						opponentMap.set(opponent.id, opponent.fullname);
					});

					const gameHistory = [];

					for (const match of matchHistory) {
						for (const game of match.games) {
							const opponentId =
								user.id === match.player1Id
									? match.player2Id
									: match.player1Id;
							const opponent = opponentMap.get(opponentId);
							const playerScore =
								user.id === match.player1Id
									? game.player1Score
									: game.player2Score;
							const opponentScore =
								user.id === match.player1Id
									? game.player2Score
									: game.player1Score;

							gameHistory.push({
								game_id: game.id,
								tournament_name: tournamentHistory.find(
									(tournament) =>
										tournament.id === match.tournament_id
								)?.tournamentName,
								match_id: match.match_id,
								set_number: game.setNum,
								round: match.roundNum,
								opponent_id: opponentId,
								opponent: opponent,
								score:
									game.player1Score + "-" + game.player2Score,
								result:
									playerScore > opponentScore
										? "Win"
										: "Loss",
							});
						}
					}

					setGameHistory(gameHistory);
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

	return (
		<>
			<div>{player ? <PlayerHero player={player} /> : <Loading />}</div>
			<div className="container mx-auto py-5 px-5">
				<p className="text-4xl font-bold pb-3">Game History</p>
				<DataTable columns={columns} data={gameHistory} />
			</div>
			<div className="container mx-auto py-5 px-5">
				<TournamentHistory tournaments={tournaments} />
			</div>
		</>
	);
}
