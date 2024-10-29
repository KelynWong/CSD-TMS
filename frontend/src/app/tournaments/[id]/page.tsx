"use client";

import "../../tournaments/styles.css";
import { useParams } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { CirclePlus } from "lucide-react";
import SetEditForm from "../_components/SetEditForm";
import CarouselComponent from "../_components/CarouselComponent";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { fetchAllPlayersByTournament, fetchTournamentById } from "@/api/tournaments/api";
import { fetchMatchByTournamentId } from "@/api/matches/api";
import TournamentResultTable from "../_components/TournamentResultTable";
import type { TournamentDetails, Match, Player } from "@/types/tournamentDetails";
import { useUserContext } from "@/context/userContext";
import { fetchOrganizer, fetchPlayer, fetchUser } from "@/api/users/api";
import { useNavBarContext } from "@/context/navBarContext";

export default function TournamentDetails() {
    // Set navbar context
    const { setState } = useNavBarContext();
    setState("tournaments");
    const { id } = useParams();
    const { user } = useUserContext();
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [tournamentDetails, setTournamentDetails] = useState<TournamentDetails | null>(null);
    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

    useEffect(() => {
		if (user) {
			const getPlayerData = async () => {
				try {
					const data = await fetchUser(user.id);
					setLoading(false);
					setRole(data.role);
				} catch (err) {
					console.error("Failed to fetch player:", err);
				}
			};
			getPlayerData();
		}
	}, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch tournament details
            const tournamentData = await fetchTournamentById(Number(id));
            const organiserData = await fetchOrganizer(tournamentData.createdBy);
            console.log(organiserData);

            let tournamentDetails = {
                id: tournamentData.id,
                tournamentName: tournamentData.tournamentName,
                startDT: new Date(new Date(tournamentData.startDT).getTime() + sgTimeZoneOffset).toISOString(),
                endDT: new Date(new Date(tournamentData.endDT).getTime() + sgTimeZoneOffset).toISOString(),
                regStartDT: new Date(new Date(tournamentData.regStartDT).getTime() + sgTimeZoneOffset).toISOString(),
                regEndDT: new Date(new Date(tournamentData.regEndDT).getTime() + sgTimeZoneOffset).toISOString(),
                status: tournamentData.status,
                organizer: organiserData,
                winner: tournamentData.winner,
                players: [] as Player[], // Initialize players as empty
                matches: [] as Match[], // Initialize matches with explicit type
            };

            const isTournamentActive = tournamentDetails.status === "Ongoing" || tournamentDetails.status === "Completed";

            if (isTournamentActive) {
                const playersData = await fetchAllPlayersByTournament(Number(id));
                const fullPlayersData = await Promise.all(
                    playersData.map(async (player) => {
                        const playerData = await fetchPlayer(player.id);
                        return {
                            id: player.id,
                            username: playerData.username,
                            fullname: playerData.fullname,
                            gender: playerData.gender,
                            rating: playerData.rating,
                            country: playerData.country,
                            profilePicture: playerData.profilePicture,
                            email: playerData.email,
                            role: playerData.role,
                        };
                    })
                );

                const matchesData = await fetchMatchByTournamentId(Number(id));
                const enrichedMatches = await Promise.all(
                    matchesData.map(async (match) => {
                        const player1 = fullPlayersData.find(player => player.id === match.player1Id) as Player || null;
                        const player2 = fullPlayersData.find(player => player.id === match.player2Id) as Player || null;
                        const winner = fullPlayersData.find(player => player.id === match.winnerId) as Player || null;
                        return {
                            id: match.id,
                            tournamentId: match.tournamentId,
                            player1,
                            player2,
                            winner,
                            left: match.left,
                            right: match.right,
                            games: match.games,
                            roundNum: match.roundNum,
                        };
                    })
                );
            
                // Add matchmaking and match details without resetting dates unnecessarily
                tournamentDetails = {
                    ...tournamentDetails,
                    players: fullPlayersData,
                    matches: enrichedMatches, // Add matches with sets
                };
            }                

            console.log(tournamentDetails);
            setTournamentDetails(tournamentDetails);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    // Fetching data
    useEffect(() => {
        fetchData();
    }, [id]);

    function getPlayerName(playerId: string): string {
        const player = tournamentDetails?.players?.find((p) => p.id === playerId);
        return player ? player.fullname : 'Unknown Player';
    }

    if (loading) {
        return <Loading />;
    }

    const totalMatches = tournamentDetails?.matches.length ?? null;

    const formattedStartDT = tournamentDetails?.startDT ? new Date(tournamentDetails.startDT) : new Date();
    const startDate = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(formattedStartDT);
    const formattedStartDate = startDate.replace(/(\w+) (\d+)/, '$1, $2'); // "Thursday, 10 October 2024"
    const startTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(formattedStartDT); // "12:30 PM"

    const formattedEndDT = tournamentDetails?.endDT ? new Date(tournamentDetails.endDT) : new Date();
    const endDate = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(formattedEndDT);
    const formattedEndDate = endDate.replace(/(\w+) (\d+)/, '$1, $2');
    const endTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(formattedEndDT);

    const formattedRegStartDT = tournamentDetails?.regStartDT ? new Date(tournamentDetails.regStartDT) : new Date();
    const regStartDate = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(formattedRegStartDT);
    const formattedRegStartDate = regStartDate.replace(/(\w+) (\d+)/, '$1, $2');
    const regStartTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(formattedRegStartDT);

    const formattedRegEndDT = tournamentDetails?.regEndDT ? new Date(tournamentDetails.regEndDT) : new Date();
    const regEndDate = new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(formattedRegEndDT);
    const formattedRegEndDate = regEndDate.replace(/(\w+) (\d+)/, '$1, $2');
    const regEndTime = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(formattedRegEndDT);

    return (
        tournamentDetails ? (
            <div className="w-full">
                <div className="w-full h-96 cardImg bg-center relative">
                    <div className="h-full overlay"></div>
                    <h1 className="w-[80%] text-4xl absolute top-2/4 left-2/4 text-white font-body font-bold text-center" style={{ transform: "translate(-50%, -50%)" }}>{tournamentDetails.tournamentName}</h1>
                </div>

                <div className="w-[80%] mx-auto py-16">
                    <div className="w-full border border-slate-200 bg-white rounded-t-lg font-body">
                        <h2 className="text-lg border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">Tournament Information</h2>
                        <div className="text-slate-600">
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-8/12">Organizer:</span>
                                <span className="w-4/12">{tournamentDetails.organizer}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-8/12">Registration Start:</span>
                                <span className="w-4/12">{formattedRegStartDate}, {regStartTime}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-8/12">Registration End:</span>
                                <span className="w-4/12">{formattedRegEndDate}, {regEndTime}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-8/12">Tournament Start:</span>
                                <span className="w-4/12">{formattedStartDate}, {startTime}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-8/12">Tournament End:</span>
                                <span className="w-4/12">{formattedEndDate}, {endTime}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-8/12">Status: </span>
                                <span className="w-4/12">{tournamentDetails.status}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-8/12">No. of Match: </span>
                                <span className="w-4/12">{totalMatches === 0 ? 'TBC' : totalMatches}</span>
                            </div>
                            <div className="flex justify-between px-6 py-3 font-semibold">
                                <span className="w-8/12">Format:</span>
                                <span className="w-4/12">Automatic Matching</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full formatPlayer my-5 flex gap-4">
                        <div className={`${tournamentDetails.status === "Ongoing" || tournamentDetails.status === "Completed" ? 'w-3/5' : 'w-full'} border border-slate-200 bg-white rounded-lg font-body`}>
                            <h2 className="text-lg border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">formats</h2>
                            <div className="p-6 pt-4 pb-16 text-slate-600">
                                <p className="mb-2">Participants</p>
                                <ul className="ml-3 list-disc list-inside">
                                    <li>There is no limit on how many players/teams participate in the tournament</li>
                                    <li>Players/teams are paired randomly for the first round, regardless of ranking or past performance.</li>
                                </ul>

                                <p className="my-2">Format</p>
                                <ul className="ml-3 list-disc list-inside">
                                    <li>Single elimination format</li>
                                    <li>All matches are best of 3 games (Bo3)</li>
                                    <li>Each game is played to 21 points (with a 2-point advantage required)</li>
                                    <li>In case of a tie at 20-20, the game continues until one player/team leads by 2 points</li>
                                </ul>

                                <p className="my-2">Qualification to Next Events</p>
                                <ul className="ml-3 list-disc list-inside">
                                    <li>First-round matchups are either random or determined based on entry order, with no predefined seeding.</li>
                                    <li>Subsequent rounds continue in a single-elimination format, with the winners advancing to the next stage.</li>
                                    <li>The winner qualifies directly for the next round or a higher-level tournament.</li>
                                </ul>
                            </div>
                        </div>

                        { tournamentDetails.status === "Ongoing" || tournamentDetails.status === "Completed" ? (
                            <div className="w-2/5 rounded-lg font-body bg-slate-100 relative">
                                <h2 className="text-lg rounded-t-lg font-body font-bold px-6 p-4 uppercase">Players</h2>
                                <CarouselComponent tournament={{ ...tournamentDetails, players: tournamentDetails.players ?? [] }} />
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>

                    { tournamentDetails.status === "Ongoing" || tournamentDetails.status === "Completed" ? (
                        tournamentDetails.matches.length > 0 ? (
                            <>
                                <div className="w-full my-5 results">
                                    <h2 className="text-lg rounded-t-lg font-body font-bold pb-2 uppercase">Results</h2>

                                    <TournamentResultTable matchResult={tournamentDetails.matches} />
                                </div>

                                <div className="w-full my-5 matches">
                                    <h2 className="text-lg rounded-lg font-body font-bold pb-2 uppercase">Matches</h2>
                                    <div className="grid grid-cols-2 gap-4">
                                        {tournamentDetails?.matches?.map((match, matchIndex: number) => (
                                            (match.player1 !== null && match.player2 !== null) && (
                                                <div key={match.id} className="w-full border border-slate-200 bg-white rounded-lg font-body">
                                                    <div className="border-b border-slate-200 bg-slate-100 rounded-t-lg flex justify-between items-center px-6 py-3">
                                                        <h2 className="text-base font-body font-bold uppercase">{`Match ${matchIndex + 1} - ${match.player1.fullname} vs ${match.player2.fullname}`}</h2>
                                                        
                                                        {match.games.length === 0 && role === "ADMIN" && (
                                                            <Sheet>
                                                                <SheetTrigger asChild>
                                                                    <CirclePlus stroke="#ec4344" strokeWidth="3" size={21} />
                                                                </SheetTrigger>

                                                                <SheetContent className="bg-white">
                                                                    <SheetHeader className="mb-6">
                                                                        <SheetTitle>Add Game Results for this Match</SheetTitle>
                                                                        <SheetDescription>
                                                                            <p className="text-red-500 font-bold">⚠️ Please ensure that the match is completed before submitting this form! ⚠️</p>
                                                                            <p>Enter the scores for each player in each game.</p>
                                                                        </SheetDescription>
                                                                    </SheetHeader>

                                                                    <SetEditForm
                                                                        matchId={match.id}
                                                                        // game={game}
                                                                        player1Name={match.player1.fullname} 
                                                                        player2Name={match.player2.fullname}
                                                                    />

                                                                </SheetContent>
                                                            </Sheet>
                                                        )}
                                                    </div>
                                                    <div className="text-slate-600">
                                                        {match.games
                                                            .sort((a, b) => a.setNum - b.setNum) // Sort games by setNum
                                                            .map((game) =>
                                                            <>
                                                                <div key={game.id} className="border-b border-slate-200 px-6 py-2 flex justify-between">
                                                                    <p className="text-slate-500">{`Set ${game.setNum}`}</p>
                                                                    {/* <Sheet>
                                                                        <SheetTrigger asChild>
                                                                            <Pencil stroke="#FFC107" strokeWidth="3" size={18} />
                                                                        </SheetTrigger>

                                                                        <SheetContent className="bg-white">
                                                                            <SheetHeader>
                                                                                <SheetTitle>Update Results for this Set</SheetTitle>
                                                                                <SheetDescription>
                                                                                    Enter the updated scores for each player in the set.
                                                                                </SheetDescription>
                                                                            </SheetHeader>

                                                                            <SetEditForm
                                                                                matchId={match.id}
                                                                                game={game}
                                                                                player1Name={getPlayerName(match.player1Id)} 
                                                                                player2Name={getPlayerName(match.player2Id)}
                                                                                onClose={refreshMatchData} // Pass the refresh callback
                                                                            />

                                                                        </SheetContent>
                                                                    </Sheet> */}
                                                                </div>
                                                                <div className="flex justify-center border-b border-slate-200">
                                                                    <div
                                                                        className={`w-2/5 flex items-center justify-end gap-2 px-4 py-5 text-black font-bold ${(game.player1Score !== null && game.player2Score !== null) && game.player1Score > game.player2Score ? 'bg-green-100' : ''
                                                                            }`}
                                                                    >
                                                                        <img src="/images/default_profile.png" className="rounded-full w-6 h-6" alt="Player Profile" />
                                                                        <p>{match.player1.fullname} </p>
                                                                    </div>
                                                                    <div className="w-1/5 flex items-center justify-center gap-2 px-4 py-5 font-bold">
                                                                        <p>{game.player1Score !== null ? game.player1Score : '?'} - {game.player2Score !== null ? game.player2Score : '?'}</p>
                                                                    </div>
                                                                    <div
                                                                        className={`w-2/5 flex items-center justify-start gap-2 px-4 py-5 text-black font-bold ${(game.player1Score !== null && game.player2Score !== null) && game.player1Score < game.player2Score ? 'bg-green-100' : ''
                                                                            }`}
                                                                    >
                                                                        <img src="/images/default_profile.png" className="rounded-full w-6 h-6" alt="Player Profile" />
                                                                        <p>{match.player2.fullname} </p>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <h2 className="text-base font-body font-bold uppercase">Loading match details...</h2>
                        )
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        ) : (
            <Loading /> // Optional: Show a loading component or placeholder
        )
    );
}