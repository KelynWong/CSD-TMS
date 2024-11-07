"use client";

import { useEffect, useState } from "react";
import "./styles.css";
import { fetchTournamentsByStatus } from "@/api/tournaments/api";
import { Tournament } from "@/types/tournament";
import Loading from "@/components/Loading";
import { useNavBarContext } from "@/context/navBarContext";
import { useRouter } from "next/navigation";
import { fetchPlayer, fetchTopPlayers } from "@/api/users/api";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import Image from "next/image";
import { Fireworks } from "@fireworks-js/react";

interface Player {
	id: string;
	gender: string;
	fullname: string;
	profilePic: string;
	rank: number;
	rating: number;
}

const shuffleArray = (array: Player[]): Player[] => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
};

export default function Home() {
	// Set navbar
	const { setState } = useNavBarContext();
	setState("home");

	const router = useRouter();

	// useEffect(() => {
	// 	router.push("/home");
	// }, [router]);

	const [ongoingTournaments, setOngoingTournaments] = useState<Tournament[]>(
		[]
	);
	const [completedTournament, setCompletedTournament] = useState<Tournament[]>(
		[]
	);
	const [playersRank, setPlayersRank] = useState<any[]>([]);
	const [players, setPlayers] = useState<any[]>([]);
	const [randomPlayers, setRandomPlayers] = useState<Player[]>([]);
	const [loading, setLoading] = useState(true);
	const [showFireworks, setShowFireworks] = useState(false);
	const sgTimeZoneOffset = 8 * 60 * 60 * 1000;
	const customOrder = [1, 0, 2];

	const words = [
		{
			text: "Welcome",
		},
		{
			text: "to",
		},
		{
			text: "RacketRush!",
			className: "text-white",
		},
	];

	useEffect(() => {
		const getCompletedTournamentData = async () => {
			try {
				const data = await fetchTournamentsByStatus("Completed");
				if (data.length === 0) {
					setCompletedTournament([]);
					return;
				}

				const firstTournament = data[0];
				console.log(firstTournament);
				const winnerData = firstTournament.winner
					? await fetchPlayer(firstTournament.winner)
					: { fullname: "Unknown" };

				const mappedData: Tournament = {
					id: firstTournament.id,
					tournamentName: firstTournament.tournamentName,
					startDT: new Date(
						new Date(firstTournament.startDT).getTime() + sgTimeZoneOffset
					).toISOString(),
					endDT: new Date(
						new Date(firstTournament.endDT).getTime() + sgTimeZoneOffset
					).toISOString(),
					status: firstTournament.status,
					regStartDT: new Date(
						new Date(firstTournament.regStartDT).getTime() + sgTimeZoneOffset
					).toISOString(),
					regEndDT: new Date(
						new Date(firstTournament.regEndDT).getTime() + sgTimeZoneOffset
					).toISOString(),
					createdBy: firstTournament.createdBy,
					winner: winnerData.fullname,
				};

				setCompletedTournament([mappedData]);
			} catch (err) {
				console.error("Failed to fetch tournaments:", err);
			}
		};

		const getOngoingTournamentsData = async () => {
			try {
				const data = await fetchTournamentsByStatus("Ongoing");
				const mappedData: Tournament[] = data.map((tournament: any) => ({
					id: tournament.id,
					tournamentName: tournament.tournamentName,
					startDT: new Date(
						new Date(tournament.startDT).getTime() + sgTimeZoneOffset
					).toISOString(),
					endDT: new Date(
						new Date(tournament.endDT).getTime() + sgTimeZoneOffset
					).toISOString(),
					status: tournament.status,
					regStartDT: new Date(
						new Date(tournament.regStartDT).getTime() + sgTimeZoneOffset
					).toISOString(),
					regEndDT: new Date(
						new Date(tournament.regEndDT).getTime() + sgTimeZoneOffset
					).toISOString(),
					createdBy: tournament.createdBy,
					winner: tournament.winner,
				}));
				setOngoingTournaments(mappedData.slice(0, 4));
			} catch (err) {
				console.error("Failed to fetch tournaments:", err);
			}
		};

		const getPlayersRank = async () => {
			try {
				const data = await fetchTopPlayers();
				const filteredData = data.map((player) => ({
					id: player.id,
					gender: player.gender,
					fullname: player.fullname,
					profilePic: player.profilePicture,
					rank: player.rank,
					rating: Math.floor(player.rating),
				}));
				setPlayers(data);
				setPlayersRank(filteredData.slice(0, 10));
			} catch (err) {
				console.error("Failed to fetch players:", err);
			} finally {
				setLoading(false);
			}
		};

		getCompletedTournamentData();
		getOngoingTournamentsData();
		getPlayersRank();
		setShowFireworks(true);
	}, []);

	useEffect(() => {
		const shuffledPlayers = shuffleArray([...players]);
		setRandomPlayers(shuffledPlayers.slice(0, 8));
	}, [players]);

	if (loading) {
		return <Loading />;
	}

	return (
		<div>
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
			<div className="latest-rank w-100 flex">
				<div className="w-1/5 title px-6 py-5 text-center">
					<h1 className="text-3xl">Latest News</h1>
				</div>
				<div className="w-4/5 players px-14 py-5 flex items-center">
					<div id="scroll-text">
						<div className="flex items-center">
							{playersRank.length !== 0 ? (
								<h3 className="text-xl mr-12">
									🥇 Rank {playersRank[0].rank} - {playersRank[0].fullname}
								</h3>
							) : (
								<h3 className="text-xl mr-12">Have a good day!</h3>
							)}
							{ongoingTournaments.length !== 0 ? (
								<h3 className="text-xl mr-12">
									🎉 {ongoingTournaments[0].tournamentName} is ongoing now!
								</h3>
							) : (
								<h3 className="text-xl mr-12">No Ongoing Tournaments D:</h3>
							)}
							{completedTournament.length !== 0 ? (
								<h3 className="text-xl mr-12">
									🏆 {completedTournament[0].winner} won{" "}
									{completedTournament[0].tournamentName}
								</h3>
							) : (
								<h3 className="text-xl mr-12">No Completed Tournaments</h3>
							)}
						</div>
					</div>
				</div>
			</div>

			{playersRank.length != 0 && (
				<div className="relative text-center py-12">
					{showFireworks && (
						<>
							<div className="absolute top-0 left-0 w-full h-full z-0">
								<Fireworks
									options={{
										hue: { min: 0, max: 345 },
										delay: { min: 15, max: 30 },
										particles: 50,
										intensity: 5,
										explosion: 10,
									}}
									className="w-full h-full"
								/>
							</div>
							<div className="absolute top-0 left-0 w-full h-full z-0">
								<Fireworks
									options={{
										hue: { min: 0, max: 345 },
										delay: { min: 15, max: 30 },
										particles: 50,
										intensity: 5,
										explosion: 10,
									}}
									className="w-full h-full"
								/>
							</div>
						</>
					)}
					<div className="relative z-10">
						<h2 className="text-3xl font-bold uppercase">
							🌟 Top performers 🌟
						</h2>
						<div className="flex items-end justify-center mt-12 gap-6">
							{customOrder.map((orderIndex) => {
								const player = playersRank[orderIndex];
								return (
									<div key={player.id} className="flex flex-col items-center">
										<Link
											prefetch={true}
											href={`/players/${player.id}`}
											className="flex flex-col items-center">
											<Image
												src={player.profilePic || "/images/default_profile.png"}
												alt={`Player ${player.id}`}
												width={200}
												height={200}
												className="w-16 h-16 object-cover rounded-full"
											/>
											<div className="w-36 text-ellipsis overflow-hidden text-lg mt-2">
												{player.fullname}
											</div>
										</Link>
										<div
											className={`w-36 flex flex-col items-center justify-center mt-3 mx-2.5 p-2.5 rounded-md text-white ${
												orderIndex === 0
													? "h-48 bg-yellow-500"
													: orderIndex === 1
													? "h-40 bg-gray-400"
													: "h-32 bg-orange-600"
											}`}>
											<div className="font-bold text-3xl">{player.rank}</div>
											<div className="text-lg">{player.rating}</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			)}

			<div className="w-[80%] mx-auto py-12">
				<div className="w-full formatPlayer py-5 flex gap-4">
					<div className="w-3/5 rounded-lg font-body mr-6">
						<div className="flex items-center justify-between mb-3">
							<h2 className="text-2xl uppercase">Ongoing Tournaments</h2>
							<Link href="/tournaments" prefetch={true}>
								<Button className="text-md font-heading tracking-wider bg-red-500 hover:bg-red-700 text-white py-2 px-3 rounded-lg">
									View All
									<ArrowRight className="ml-2" size={18} />
								</Button>
							</Link>
						</div>
						{ongoingTournaments.length === 0 ? (
							<div className="text-center text-md italic mt-16">
								No ongoing tournaments found.
							</div>
						) : (
							<div className="w-full grid grid-cols-2 gap-4">
								{ongoingTournaments.map((tournament: Tournament) => (
									<Link href={`/tournaments/${tournament.id}`} prefetch={true}>
										<div
											key={tournament.id}
											className="tournament tournament-bg flex flex-col items-center justify-between rounded-lg bg-slate-100 px-3 py-6">
											<div className="tournament-info">
												<div className="tournament-details text-center">
													<h3 className="text-xl font-bold text-white">
														{tournament.tournamentName}
													</h3>
													<h4 className="text-lg text-yellow-500">
														Start Date:{" "}
														{new Date(tournament.startDT).toLocaleDateString()}
													</h4>
													<h4 className="text-lg text-yellow-500">
														End Date:{" "}
														{new Date(tournament.endDT).toLocaleDateString()}
													</h4>
												</div>
											</div>
											<div className="tournament-action flex items-center justify-center gap-4 mt-4">
												<Link href="/prediction" prefetch={true}>
													<Button className="font-heading">Predict</Button>
												</Link>
											</div>
										</div>
									</Link>
								))}
							</div>
						)}
					</div>
					<div className="w-2/5 rounded-lg font-body">
						<div className="flex items-center justify-between mb-3">
							<h2 className="text-2xl rounded-t-lg font-bold uppercase">
								Current Rankings
							</h2>
							<Link href="/rankings" prefetch={true}>
								<Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
									<ArrowUpRight size={18} />
								</Button>
							</Link>
						</div>
						<div className="w-full flex flex-col gap-4">
							{playersRank.length === 0 ? (
								<div className="text-center text-md italic">
									No players found.
								</div>
							) : (
								<div className="tournament w-full flex flex-col items-center justify-between rounded-lg bg-slate-100 p-4">
									<Table>
										<TableHeader>
											<TableRow className="hover:bg-transparent">
												<TableHead>Rank</TableHead>
												<TableHead>Name</TableHead>
												<TableHead>Rating</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{playersRank.map((player) => (
												<TableRow
													key={player.id}
													className="tournament-info hover:bg-slate-200">
													{/* <div className="tournament-details text-center"> */}
													<TableCell>{player.rank}</TableCell>
													<TableCell>
														<Link
															href={`/players/${player.id}`}
															prefetch={true}>
															{player.fullname}
														</Link>
													</TableCell>
													<TableCell>{player.rating}</TableCell>
													{/* </div> */}
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className="w-full formatPlayer py-8">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-2xl rounded-t-lg font-bold uppercase">
							Players Squad
						</h2>
						<Link href="/players" prefetch={true}>
							<Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
								<ArrowUpRight size={18} />
							</Button>
						</Link>
					</div>
					{players.length === 0 ? (
						<div className="text-center text-md italic">No players found.</div>
					) : (
						<div className="w-full grid grid-cols-4 gap-6">
							{randomPlayers.map((player) => (
								<div key={player.id}>
									<Link href={`/players/${player.id}`} prefetch={true}>
										<Image
											src={
												player.gender === "Female"
													? player.profilePic || "/images/female.jpeg"
													: player.profilePic || "/images/male.jpeg"
											}
											alt={`Player ${player.id}`}
											width={200}
											height={200}
											className="object-cover object-top rounded-lg w-full h-44"
										/>
										<div className="flex flex-row justify-between items-start mt-3">
											<div className="flex flex-col">
												<p className="text-lg font-bold leading-none">
													{player.fullname}
												</p>
												<p className="text-md font-bold text-red-500 leading-2">
													{player.rating}
												</p>
											</div>
											<div className="rounded-full size-8 bg-red-500">
												<p className="text-lg text-white text-center h-full m-0 p-0 leading-8">
													{player.rank}
												</p>
											</div>
										</div>
									</Link>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
