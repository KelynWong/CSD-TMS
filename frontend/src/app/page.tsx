"use client";

import { useEffect, useState } from 'react';
import './styles.css';
import { fetchTournamentsByStatus } from '@/api/tournaments/api';
import { Tournament } from '@/types/tournament';
import Loading from '@/components/Loading';
import { useNavBarContext } from "@/context/navBarContext";
import { useRouter } from "next/navigation";
import { fetchTopPlayers } from '@/api/users/api';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import Image from "next/image";

export default function Home() {
	// Set navbar
	const { setState } = useNavBarContext();
	setState("home");

	const router = useRouter();

	// useEffect(() => {
	// 	router.push("/home");
	// }, [router]);

    const [categorizedTournaments, setCategorizedTournaments] = useState<Tournament[]>([]);
	const [playersRank, setPlayersRank] = useState<any[]>([]);
	const [players, setPlayers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

	const words = [
		{
			text: "Welcome",
            className: "text-sky-950"
		},
		{
			text: "to",
            className: "text-sky-950"
		},
		{
			text: "RacketRush!",
            className: "text-yellow-500"
		},
	];

    useEffect(() => {
        const getTournamentsData = async () => {
            try {
                const data = await fetchTournamentsByStatus("Ongoing");
                const mappedData: Tournament[] = data.map((tournament: any) => ({
                    id: tournament.id,
                    tournamentName: tournament.tournamentName,
                    startDT: new Date(new Date(tournament.startDT).getTime() + sgTimeZoneOffset).toISOString(),
                    endDT: new Date(new Date(tournament.endDT).getTime() + sgTimeZoneOffset).toISOString(),
                    status: tournament.status,
                    regStartDT: new Date(new Date(tournament.regStartDT).getTime() + sgTimeZoneOffset).toISOString(),
                    regEndDT: new Date(new Date(tournament.regEndDT).getTime() + sgTimeZoneOffset).toISOString(),
                    createdBy: tournament.createdBy,
                    winner: tournament.winner,
                }));
                setCategorizedTournaments(mappedData.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
            } finally {
                setLoading(false);
            }
        };

		const getPlayersRank = async () => {
            try {
                const data = await fetchTopPlayers();
                const filteredData = data.map(player => ({
					id: player.id,
					fullname: player.fullname,
					rank: player.rank,
					rating: Math.floor(player.rating)
				}));
				setPlayers(data);
                setPlayersRank(filteredData.slice(0, 10));
            } catch (err) {
                console.error("Failed to fetch players:", err);
            } finally {
                setLoading(false);
            }
        };

        getTournamentsData();
		getPlayersRank();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            {/* <div className="header px-16 py-16">
				<div className="match-overview w-100 flex flex-col items-end">
					<div className="match w-1/4 my-3 p-6 rounded-xl">
						<h2 className="text-2xl pb-2 text-center border-b border-gray-500">
							Ongoing Match
						</h2>
						<h3 className="text-xl py-2">Tournament 1</h3>
						<div className="flex justify-center">
							<div className="w-1/4 flex items-center justify-end gap-2 px-4 text-black font-bold">
								<img
									src="/images/default_profile.png"
									className="rounded-full w-12 h-12"
									alt="Player Profile"
								/>
							</div>
							<div className="flex items-center justify-center gap-2 px-2 font-bold">
								<h1 className="text-xl score rounded-full px-6 py-1">2 - 3</h1>
							</div>
							<div className="w-1/4 flex items-center justify-start gap-2 px-4 text-black font-bold">
								<img
									src="/images/default_profile.png"
									className="rounded-full w-12 h-12"
									alt="Player Profile"
								/>
							</div>
						</div>
					</div>
					<div className="match w-1/4 my-3 p-6 rounded-xl">
						<h2 className="text-2xl pb-2 text-center border-b border-gray-500">
							Next Match
						</h2>
						<h3 className="text-xl py-2">SMU BadminFest 2024</h3>
						<div className="flex justify-center">
							<div className="w-1/4 flex items-center justify-end gap-2 px-4 text-black font-bold">
								<img
									src="/images/default_profile.png"
									className="rounded-full w-12 h-12"
									alt="Player Profile"
								/>
							</div>
							<div className="flex items-center justify-center gap-2 px-2 font-bold">
								<h1 className="text-xl px-6 py-1">VS</h1>
							</div>
							<div className="w-1/4 flex items-center justify-start gap-2 px-4 text-black font-bold">
								<img
									src="/images/default_profile.png"
									className="rounded-full w-12 h-12"
									alt="Player Profile"
								/>
							</div>
						</div>
					</div>
				</div>
			</div> */}
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
					<h1 className="text-3xl">latest Ranking</h1>
				</div>
				<div className="w-4/5 players px-14 py-5 flex items-center">
					<div id="scroll-text">
						<div className="flex items-center">
							<h3 className="text-xl mr-12">🥇 rank 1 - Wang zhi yi</h3>
							<h3 className="text-xl mr-12">
								🎉 Jeng Hon Chia 21 - 10 Benson Wang
							</h3>
							<h3 className="text-xl mr-12">
								🎉 Jeng Hon Chia 21 - 10 Benson Wang
							</h3>
						</div>
					</div>
				</div>
			</div>
            <div className="w-[80%] mx-auto py-12">
                <div className="w-full formatPlayer my-5 flex gap-4">
                    <div className="w-3/5 rounded-lg font-body mr-6">
						<div className="flex items-center justify-between mb-3">
							<h2 className="text-2xl rounded-t-lg font-bold uppercase">Ongoing Tournaments</h2>
							<Link href="/tournaments">
								<Button className="text-md font-heading tracking-wider bg-red-500 hover:bg-red-700 text-white py-2 px-3 rounded-lg">
									View All
									<ArrowRight className="ml-2" size={18} />
								</Button>
							</Link>
						</div>
                        <div className="w-full flex flex-col gap-4">
                            {categorizedTournaments.length === 0 ? (
                                <div className="text-center text-md italic">
                                    No ongoing tournaments found.
                                </div>
                            ) : (
                                categorizedTournaments.map((tournament: Tournament) => (
									<Link href={`/tournaments/${tournament.id}`}>
										<div key={tournament.id} className="tournament tournament-bg w-1/2 flex flex-col items-center justify-between rounded-lg bg-slate-100 p-4">
											<div className="tournament-info">
												<div className="tournament-details text-center">
													<h3 className="text-xl font-bold text-white">{tournament.tournamentName}</h3>
													<h4 className="text-lg text-yellow-500">Start Date: {new Date(tournament.startDT).toLocaleDateString()}</h4>
													<h4 className="text-lg text-yellow-500">End Date: {new Date(tournament.endDT).toLocaleDateString()}</h4>
												</div>
											</div>
											<div className="tournament-action flex items-center justify-center gap-4 mt-4">
												<Link href="/prediction">
													<Button className="font-heading">Predict</Button>
												</Link>
											</div>
										</div>
									</Link>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="w-2/5 rounded-lg font-body">
						<div className="flex items-center justify-between mb-3">
							<h2 className="text-2xl rounded-t-lg font-bold uppercase">Current Rankings</h2>
							<Link href="/rankings">
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
											<TableRow>
												<TableHead>Rank</TableHead>
												<TableHead>Name</TableHead>
												<TableHead>Rating</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{playersRank.map((player) => (
												<TableRow key={player.id} className="tournament-info">
													{/* <div className="tournament-details text-center"> */}
														<TableCell>{player.rank}</TableCell>
														<TableCell>{player.fullname}</TableCell>
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

				<div className="w-full formatPlayer my-8">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-2xl rounded-t-lg font-bold uppercase">Players Squad</h2>
						<Link href="/players">
							<Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
								<ArrowUpRight size={18} />
							</Button>
						</Link>
					</div>
					<div className="w-full flex flex-col gap-4">
						{players.length === 0 ? (
							<div className="text-center text-md italic">
								No players found.
							</div>
						) : (
							<div className="w-full flex flex-col gap-4">
								{players.map((player) => (
									<Link href={`/players/${player.id}`}>
										<div key={player.id} className="tournament tournament-bg w-1/4 flex flex-col items-center justify-between rounded-lg bg-slate-100 p-4">
											<div className="tournament-info">
												<div className="tournament-details text-center">
													<h3 className="text-xl font-bold text-white">{player.fullname}</h3>
													<h4 className="text-lg text-yellow-500">Start Date: {new Date(player.startDT).toLocaleDateString()}</h4>
													<h4 className="text-lg text-yellow-500">End Date: {new Date(player.endDT).toLocaleDateString()}</h4>
												</div>
											</div>
											<div className="tournament-action flex items-center justify-center gap-4 mt-4">
												<Link href="/prediction">
													<Button className="font-heading">Predict</Button>
												</Link>
											</div>
										</div>
									</Link>
								))}
                        	</div>
						)}
					</div>
                </div>
            </div>
        </div>
    );
}