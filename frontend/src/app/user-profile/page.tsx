// This line enables client-side rendering for this page
"use client";
import PlayerHero from "@/components/PlayerHero";
import { Player } from "@/types/player";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";
import TournamentHistory from "@/components/TournamentHistory";
import { formatDate } from "@/utils/dateFormatter";
import { useState, useEffect } from "react";
import { fetchPlayer, PlayerResponse } from "@/api/users/api";
import Loading from "@/components/Loading";
import { useUserContext } from "@/context/userContext";
import { fetchPlayerMatches, fetchPlayerStats } from "@/api/matches/api";
import {
	fetchTournamentByPlayerId,
	tournamentResponse,
} from "@/api/tournaments/api";
import { useNavBarContext } from "@/context/navBarContext";

// UserProfile component definition
export default function UserProfile() {
	// Set navbar context to 'user-profile'
	const { setState } = useNavBarContext();
	setState("user-profile");

	const { user } = useUserContext(); // Get the current user from user context
	const [player, setPlayer] = useState<Player | null>(null); // State to manage the player data
	const [tournaments, setTournaments] = useState<tournamentResponse[]>([]); // State to manage tournament history
	const [loading, setLoading] = useState(true); // State to manage loading status
	const [gameHistory, setGameHistory] = useState([]); // State to manage game history
	const [tournamentNames, setTournamentNames] = useState<String[]>([]); // State to manage unique tournament names

	useEffect(() => {
		if (user) {
			const getPlayerData = async () => {
				try {
					// Fetch player data, stats, tournaments, and matches in parallel
					const [data, stats, tournaments, matches] = await Promise.all([
						fetchPlayer(user.id), // Fetch player data
						fetchPlayerStats(user.id), // Fetch player stats
						fetchTournamentByPlayerId(user.id), // Fetch tournaments by player ID
						fetchPlayerMatches(user.id), // Fetch player matches
					]);
					setLoading(false); // Set loading to false after data is fetched
					// Map the fetched data to the Player type
					const mappedData: Player = {
						id: user.id,
						username: user.username,
						fullname: user.fullName,
						gender: user.gender,
						ranking: data.rank,
						rating: data.rating ? data.rating : 0,
						wins: stats.wins ? stats.wins : 0,
						losses: stats.losses ? stats.losses : 0,
						total_matches: stats.gamesPlayed ? stats.gamesPlayed : 0,
						profilePicture: user.imageUrl,
						country: user.publicMetadata.country,
					};

					// Map the fetched tournaments to the tournamentResponse type
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

					// Map the fetched matches to the matchResponse type
					const matchHistory = matches.map((match) => ({
						match_id: match.id,
						winner_id: match.winnerId,
						tournament_id: match.tournamentId,
						player1Id: match.player1Id,
						player2Id: match.player2Id,
						games: match.games,
						roundNum: match.roundNum,
					}));

					// Collect all the opponent ids
					const opponentIds = new Set();
					matchHistory.forEach((match) => {
						const opponentId =
							user.id === match.player1Id ? match.player2Id : match.player1Id;
						opponentIds.add(opponentId);
					});

					// Fetch all opponents' data in one go
					const opponentData: PlayerResponse[] = await Promise.all(
						Array.from(opponentIds)
							.filter((id): id is string => id !== null) // Filter out null values
							.map((id) => fetchPlayer(id))
					);

					// Create a map of opponent ids to their names
					const opponentMap = new Map<string, string>();
					opponentData.forEach((opponent) => {
						opponentMap.set(opponent.id, opponent.fullname);
					});

					// Map the fetched games to the gameResponse type
					const gameHistory = [];

					for (const match of matchHistory) {
						for (const game of match.games) {
							const opponentId =
								user.id === match.player1Id ? match.player2Id : match.player1Id;
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
									(tournament) => tournament.id === match.tournament_id
								)?.tournamentName,
								match_id: match.match_id,
								set_number: game.setNum,
								round: match.roundNum,
								opponent_id: opponentId,
								opponent: opponent,
								score: game.player1Score + "-" + game.player2Score,
								result: playerScore > opponentScore ? "Win" : "Loss",
							});
						}
					}

					setGameHistory(gameHistory);
					setTournaments(tournamentHistory);
                    console.log(tournamentHistory)
					setPlayer(mappedData);

					// Get unique tournament names
					const uniqueTournamentNames = Array.from(
						new Set(
							tournamentHistory.map((tournament) => tournament.tournamentName)
						)
					);

					setTournamentNames(uniqueTournamentNames);
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
				<DataTable
					columns={columns}
					data={gameHistory}
					tournamentNames={tournamentNames}
				/>
			</div>
			<div className="container mx-auto py-5 px-5">
				<TournamentHistory tournaments={tournaments} />
			</div>
		</>
	);
}
