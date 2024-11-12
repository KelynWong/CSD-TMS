"use client";
import PlayerHero from "@/components/PlayerHero";
import { Player } from "@/types/player";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";
import TournamentHistory from "./_components/TournamentHistory";
import { formatDate } from "@/utils/dateFormatter";
import { fetchPlayer, getPlayerRank, PlayerResponse } from "@/api/users/api";
import { fetchPlayerStats, fetchPlayerMatches } from "@/api/matches/api";
import Loading from "@/components/Loading";
import React, { useState, useEffect } from "react";
import {
	fetchTournamentByPlayerId,
	tournamentResponse,
} from "@/api/tournaments/api";
import { useNavBarContext } from "@/context/navBarContext";

export default function PlayerProfile({ params }: { params: { id: string } }) {
	// Set navbar context
	const { setState } = useNavBarContext();
	setState("players");
	const [player, setPlayer] = useState<Player | null>(null);
	// Set loading state
	const [loading, setLoading] = useState(true);
	const [tournaments, setTournaments] = useState<tournamentResponse[]>([]);
	const [gameHistory, setGameHistory] = useState([]);
	const [tournamentNames, setTournamentNames] = useState<String[]>([]);

	useEffect(() => {
		const getPlayerData = async () => {
			try {
				const [data, stats, tournaments, matches] = await Promise.all([
					fetchPlayer(params.id),
					fetchPlayerStats(params.id),
					fetchTournamentByPlayerId(params.id),
					fetchPlayerMatches(params.id),
				]);
				setLoading(false);
				const mappedData: Player = {
					id: data.id,
					username: data.username,
					fullname: data.fullname,
					gender: data.gender,
					ranking: data.rank,
					rating: data.rating ? data.rating : 0,
					wins: stats.wins ? stats.wins : 0,
					losses: stats.losses ? stats.losses : 0,
					total_matches: stats.gamesPlayed ? stats.gamesPlayed : 0,
					profilePicture: data.profilePicture,
					country: data.country,
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

				const matchHistory = matches.map((match) => ({
					match_id: match.id,
					winner_id: match.winnerId,
					tournament_id: match.tournamentId,
					player1Id: match.player1Id,
					player2Id: match.player2Id,
					games: match.games,
					roundNum: match.roundNum,
				}));

				// Collect all opponent IDs
				const opponentIds = new Set();
				matchHistory.forEach((match) => {
					const opponentId =
						params.id === match.player1Id ? match.player2Id : match.player1Id;
					opponentIds.add(opponentId);
				});

				// Fetch all opponents' data in one go
				const opponentData: PlayerResponse[] = await Promise.all(
					Array.from(opponentIds)
						.filter((id): id is string => id !== null) // Filter out null values
						.map((id) => fetchPlayer(id))
				);

				// Create a map of opponent IDs to their names
				const opponentMap = new Map<string, string>();
				opponentData.forEach((opponent) => {
					opponentMap.set(opponent.id, opponent.fullname);
				});

				const gameHistory = [];

				for (const match of matchHistory) {
					for (const game of match.games) {
						const opponentId =
							params.id === match.player1Id ? match.player2Id : match.player1Id;
						if (opponentId === null) {
							continue; // skip this game
						}
						const opponent = opponentMap.get(opponentId);
						const playerScore =
							params.id === match.player1Id
								? game.player1Score
								: game.player2Score;
						const opponentScore =
							params.id === match.player1Id
								? game.player2Score
								: game.player1Score;

						gameHistory.push({
							game_id: game.id,
							tournament_name: tournamentHistory.find(
								(tournament) => tournament.id === match.tournament_id
							)?.tournamentName,
							tournament_id: match.tournament_id,
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
				setPlayer(mappedData);

				// Store a list of unique tournament names
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
	}, [params.id]);

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
