"use client";

import { useEffect, useState } from 'react';
import './styles.css';
import { fetchTournamentsByStatus } from '@/api/tournaments/api';
import { Tournament } from '@/types/tournament';
import Loading from '@/components/Loading';
import "./styles.css";
import { useNavBarContext } from "@/context/navBarContext";
import { useRouter } from "next/navigation";

export default function Home() {
	// Set navbar
	const { setState } = useNavBarContext();
	setState("home");

	const router = useRouter();

	// useEffect(() => {
	// 	router.push("/home");
	// }, [router]);

    const [categorizedTournaments, setCategorizedTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

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

        getTournamentsData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div>
            <div className="header px-16 py-16">
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
            <div className="w-[80%] mx-auto py-16">
                <div className="w-full formatPlayer my-5 flex gap-4">
                    <div className="w-3/5 rounded-lg mx-4 font-body">
                        <h2 className="text-2xl rounded-t-lg font-bold uppercase mb-3">Ongoing Tournaments</h2>
                        <div className="w-full flex flex-col gap-4">
                            {categorizedTournaments.length === 0 ? (
                                <div className="text-center text-md italic">
                                    No ongoing tournaments found.
                                </div>
                            ) : (
                                categorizedTournaments.map((tournament: Tournament) => (
                                    <div key={tournament.id} className="tournament w-1/2 flex flex-col items-center justify-between rounded-lg bg-slate-100 p-4">
                                        <div className="tournament-info">
                                            <div className="tournament-details text-center">
                                                <h3 className="text-xl font-bold">{tournament.tournamentName}</h3>
                                                <p className="text-lg">Start Date: {new Date(tournament.startDT).toLocaleDateString()}</p>
                                                <p className="text-lg">End Date: {new Date(tournament.endDT).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="tournament-action flex items-center justify-center gap-4">
                                            <button className="btn btn-primary">View</button>
                                            <button className="btn btn-secondary">Predict</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="w-2/5 rounded-lg mx-4 font-body">
                        <h2 className="text-2xl rounded-t-lg font-bold uppercase mb-3">Current Rankings</h2>
                        <div className="w-full flex flex-col gap-4">
                            {categorizedTournaments.length === 0 ? (
                                <div className="text-center text-md italic">
                                    No players found.
                                </div>
                            ) : (
                                categorizedTournaments.map((tournament: Tournament) => (
                                    <div key={tournament.id} className="tournament w-1/2 flex flex-col items-center justify-between rounded-lg bg-slate-100 p-4">
                                        <div className="tournament-info">
                                            <div className="tournament-details text-center">
                                                <h3 className="text-xl font-bold">{tournament.tournamentName}</h3>
                                                <p className="text-lg">Start Date: {new Date(tournament.startDT).toLocaleDateString()}</p>
                                                <p className="text-lg">End Date: {new Date(tournament.endDT).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="tournament-action flex items-center justify-center gap-4">
                                            <button className="btn btn-primary">View</button>
                                            <button className="btn btn-secondary">Predict</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}