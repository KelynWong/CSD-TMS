// This is the main page of the application
"use client";

// Importing necessary libraries and components
import { useEffect, useState } from "react";
import "./styles.css";
import { fetchTournamentsByStatus } from "@/api/tournaments/api";
import { Tournament } from "@/types/tournament";
import Loading from "@/components/Loading";
import { useNavBarContext } from "@/context/navBarContext";
import { fetchPlayer, fetchTopPlayers } from "@/api/users/api";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Image from "next/image";
import { Player } from "@/types/player";
import { NewsSection } from "@/components/HomePageSections/NewsSection";
import ErrorDisplay from "@/components/ErrorDisplay";
import { TopPerformersSection } from "@/components/HomePageSections/TopPerformersSection";
import { OngoingTournamentsSection } from "@/components/HomePageSections/OngoingTournamentsSection";
import { PlayerSquadSection } from "@/components/HomePageSections/PlayerSquadSection";
import { PlayersRankSection } from "@/components/HomePageSections/PlayersRankSection";

// Function to shuffle an array (used for displaying random players)
const shuffleArray = (array: Player[]): Player[] => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

// Main Home component
export default function Home() {
	// set current navigation state
	const { setState } = useNavBarContext();
	setState("home");

	// States for tournaments, players, and UI
	const [ongoingTournaments, setOngoingTournaments] = useState<Tournament[]>([]);
	const [completedTournament, setCompletedTournament] = useState<Tournament[]>([]);
	const [playersRank, setPlayersRank] = useState<any[]>([]);
	const [players, setPlayers] = useState<any[]>([]);
	const [randomPlayers, setRandomPlayers] = useState<Player[]>([]);
	const [loading, setLoading] = useState(true); // Tracks loading state
	const [tournamentErr, setTournamentErr] = useState(false); // Tracks tournament fetch errors
	const [playersErr, setPlayersErr] = useState(false); // Tracks player fetch errors
	const [showFireworks, setShowFireworks] = useState(false); // Controls fireworks animation
	
	// Singapore timezone offset in milliseconds
	const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

	// Custom order for displaying top performers
	const customOrder = [1, 0, 2];

	// Words for the TypewriterEffect component
	const words = [
		{ text: "Welcome" },
		{ text: "to" },
		{ text: "RacketRush!", className: "text-white" }
	];

	// Fetch tournaments and players data
	useEffect(() => {
		const fetchData = async () => {
			await Promise.all([
				fetchCompletedTournament(),
				fetchOngoingTournaments(),
				fetchPlayerRankings(),
			]);
			setShowFireworks(true);
		};

		fetchData();
	}, []);

	// Update random players list when players data changes
	useEffect(() => {
		setRandomPlayers(shuffleArray([...players]).slice(0, 8));
	}, [players]);

	// Fetch completed tournaments
	const fetchCompletedTournament = async () => {
		try {
			const data = await fetchTournamentsByStatus("Completed");
			if (data.length === 0) return setCompletedTournament([]);

			const firstTournament = data[0];
			const winnerData = firstTournament.winner
				? await fetchPlayer(firstTournament.winner)
				: { fullname: "Unknown" };

			setCompletedTournament([
				mapTournamentData(firstTournament, winnerData.fullname),
			]);
		} catch (error) {
			setTournamentErr(true);
		}
	};

	// Fetch ongoing tournaments
	const fetchOngoingTournaments = async () => {
		try {
			const data = await fetchTournamentsByStatus("Ongoing");
			const mappedTournaments = data.map((tournament) =>
				mapTournamentData(tournament)
			);
			setOngoingTournaments(mappedTournaments.slice(0, 4));
		} catch (error) {
			setTournamentErr(true);
		}
	};

	// Fetch top players
	const fetchPlayerRankings = async () => {
		try {
			const data = await fetchTopPlayers();
			const mappedPlayers = data.map((player) => ({
				id: player.id,
				gender: player.gender,
				fullname: player.fullname,
				profilePic: player.profilePicture,
				rank: player.rank,
				rating: Math.floor(player.rating),
			}));
			setPlayers(data);
			setPlayersRank(mappedPlayers.slice(0, 10));
		} catch (error) {
			setPlayersErr(true);
		} finally {
			setLoading(false);
		}
	};
	
	// Map tournament data to include timezone offset
	const mapTournamentData = (tournament: Tournament, winner: string | null = null) => ({
		id: tournament.id,
		tournamentName: tournament.tournamentName,
		startDT: applyTimezoneOffset(tournament.startDT),
		endDT: applyTimezoneOffset(tournament.endDT),
		regStartDT: applyTimezoneOffset(tournament.regStartDT),
		regEndDT: applyTimezoneOffset(tournament.regEndDT),
		status: tournament.status,
		createdBy: tournament.createdBy,
		winner: winner || tournament.winner,
	});

	// Apply timezone offset
	const applyTimezoneOffset = (dateString: string | number | Date) =>
		new Date(new Date(dateString).getTime() + sgTimeZoneOffset).toISOString();

	// Render loading state
	if (loading) return <Loading />;

	// Render the main page
	return (
		<div>
			{/* Banner Section */}
			<div style={{ position: "relative", height: "60vh", overflow: "hidden" }}>
				<Image
					src="/images/banner4.png"
					alt="Background"
					layout="fill"
					objectFit="cover"
					className="opacity-70 z-10"
					priority
				/>
				<div className="absolute h-full w-full bg-black"></div>
				<div className="absolute top-0 left-0 right-0 bottom-40 m-auto flex flex-col items-center justify-center z-20 text-white">
					<TypewriterEffect words={words} />
					<p>Test your skills and join exciting badminton tournaments!</p>
				</div>
			</div>

			{/* News Section */}
			<NewsSection
				playersRank={playersRank}
				ongoingTournaments={ongoingTournaments}
				completedTournament={completedTournament}
				errors={{ playersErr, tournamentErr }}
			/>

			{playersErr && tournamentErr ? (
				<ErrorDisplay message="No data found"/>
			) : (
				<>
					{/* Top Performers Section */}
					{playersRank.length && (
						<TopPerformersSection
							playersRank={playersRank}
							showFireworks={showFireworks}
							customOrder={customOrder}
						/>
					)}

					{/* Ongoing Tournaments and Player Squad Section */}
					<div className="w-[80%] mx-auto py-12">
						<div className="w-full formatPlayer py-5 flex gap-4">
							<OngoingTournamentsSection ongoingTournaments={ongoingTournaments} />
							<PlayersRankSection playersRank={playersRank} />
						</div>
						
						<PlayerSquadSection players={randomPlayers} />
					</div>
				</>
			)}
		</div>
	);
}