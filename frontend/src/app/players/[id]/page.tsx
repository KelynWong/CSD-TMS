"use client";
import PlayerHero from "@/components/PlayerHero";
import { Player } from "@/types/player";
import { Match } from "@/types/match";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/DataTableColumns";
import TournamentHistory from "@/components/TournamentHistory";
import { formatDate } from "@/utils/dateFormatter";
import { fetchPlayer } from "@/api/users/api";
import { fetchPlayerStats } from "@/api/matches/api";
import Loading from "@/components/Loading";
import React, { useState, useEffect } from "react";

export default function PlayerProfile({ params }: { params: { id: string } }) {
	const [player, setPlayer] = useState<Player | null>(null);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const getPlayerData = async () => {
			try {
				const data = await fetchPlayer(params.id);
				const stats = await fetchPlayerStats(params.id);
				setLoading(false);
				const mappedData: Player = {
					id: data.id,
					username: data.username,
					fullname: data.fullname,
					gender: data.gender,
					ranking: 1,
					rating: data.rating ? data.rating : 0,
					wins: stats.wins ? stats.wins : 0,
					losses: stats.losses ? stats.losses : 0,
					total_matches: stats.gamesPlayed ? stats.gamesPlayed : 0,
					profilePicture: data.profilePicture,
					country: data.country,
				};
				setPlayer(mappedData);
			} catch (err) {
				console.error("Failed to fetch player:", err);
			}
		};
		getPlayerData();
	}, [params.id]);

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

	type Tournament = {
		id: number;
		name: string;
		start_date: string;
		end_date: string;
		status: string;
		result: string;
	};

	const TournamentHistories: Tournament[] = [
		// Add your tournament history data here
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "Completed",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "Completed",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "Completed",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
		},
		{
			id: 1,
			name: "Singapore Open",
			start_date: formatDate(new Date("2024-01-01 10:00:00")),
			end_date: formatDate(new Date("2024-01-01 10:00:00")),
			status: "In Progress",
			result: "Win",
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
				<TournamentHistory tournaments={TournamentHistories} />
			</div>
		</>
	);
}
