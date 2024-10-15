"use client";

import "../../tournaments/styles.css";
import { useParams } from 'next/navigation';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Pencil } from "lucide-react";
import SetEditForm from "../_components/SetEditForm";
import CarouselComponent from "../_components/CarouselComponent";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { fetchTournamentById } from "@/api/tournaments/api";
import { fetchGamesByMatchId, fetchMatchByTournamentId } from "@/api/matches/api";
import TournamentResultTable from "../_components/TournamentResultTable";
import { fetchMatchMakingByTournamentId } from "@/api/matchmaking/api";
import type { RootMatch, TournamentDetails, Match } from "@/types/tournamentDetails";

function countMatches(rootMatch: RootMatch | null): number {
    if (!rootMatch) {
        return 0;
    }
    
    // Count the current match + recursively count matches on the left and right
    const leftCount = rootMatch.left ? countMatches(rootMatch.left) : 0;
    const rightCount = rootMatch.right ? countMatches(rootMatch.right) : 0;
    
    return 1 + leftCount + rightCount; // 1 for the current match
}

export default function TournamentDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [tournamentDetails, setTournamentDetails] = useState<TournamentDetails | null>(null);
    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;
    

    // Fetching data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch tournament details
                const tournamentData = await fetchTournamentById(Number(id));

                let tournamentDetails = {
                    id: tournamentData.id,
                    tournamentName: tournamentData.tournamentName,
                    startDT: tournamentData.startDT ? new Date(new Date(tournamentData.startDT).getTime() + sgTimeZoneOffset).toISOString() : "hi",
                    endDT: new Date(new Date(tournamentData.endDT).getTime() + sgTimeZoneOffset).toISOString(),
                    regStartDT: new Date(new Date(tournamentData.regStartDT).getTime() + sgTimeZoneOffset).toISOString(),
                    regEndDT: new Date(new Date(tournamentData.regEndDT).getTime() + sgTimeZoneOffset).toISOString(),
                    status: tournamentData.status,
                    organizer: tournamentData.createdBy,
                    rootMatch: null, // Initialize rootMatch as empty
                    players: [], // Initialize players as empty
                    matches: [] as Match[], // Initialize matches with explicit type
                };

                const isTournamentActive = tournamentDetails.status === "Ongoing" || tournamentDetails.status === "Completed";

                if (isTournamentActive) {
                    const mmData = await fetchMatchMakingByTournamentId(Number(id));
                    const matchesData = await fetchMatchByTournamentId(Number(id));
                
                    const enrichedMatches = await Promise.all(
                        matchesData.map(async (match) => {
                            const games = await fetchGamesByMatchId(match.id);
                            return {
                                id: match.id,
                                tournamentId: match.tournamentId,
                                player1Id: match.player1Id,
                                player2Id: match.player2Id,
                                winnerId: match.winnerId,
                                left: match.left,
                                right: match.right,
                                games: games.map((game) => ({
                                    id: game.id,
                                    setNum: game.setNum,
                                    player1Score: game.player1Score,
                                    player2Score: game.player2Score,
                                })),
                            };
                        })
                    );
                
                    // Add matchmaking and match details without resetting dates unnecessarily
                    tournamentDetails = {
                        ...tournamentDetails,
                        ...mmData,
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

        fetchData();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

    const totalMatches = countMatches(tournamentDetails?.rootMatch ?? null);

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
                                <span className="w-9/12">Organizer:</span>
                                <span className="w-3/12">{tournamentDetails.organizer}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-9/12">Registration Dates:</span>
                                <span className="w-3/12">{tournamentDetails.regStartDT} - {tournamentDetails.regEndDT}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-9/12">Tournament Dates:</span>
                                <span className="w-3/12">{tournamentDetails.startDT} - {tournamentDetails.endDT}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-9/12">Status: </span>
                                <span className="w-3/12">{tournamentDetails.status}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-9/12">No. of Match: </span>
                                <span className="w-3/12">{totalMatches === 0 ? 'TBC' : totalMatches}</span>
                            </div>
                            <div className="flex justify-between px-6 py-3 font-semibold">
                                <span className="w-9/12">Format:</span>
                                <span className="w-3/12">Automatic Matching</span>
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
                                    <li>Top 8 seeds based on the BWF World Rankings</li>
                                    <li>Wild card entries and qualifiers fill remaining slots</li>
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
                                    <li>The winner qualifies directly for the next Super Series tournament</li>
                                    <li>Top 8 players/teams qualify for the BWF World Tour Finals</li>
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
                        <>
                            <div className="w-full my-5 results">
                                <h2 className="text-lg rounded-t-lg font-body font-bold pb-2 uppercase">Results</h2>

                                {tournamentDetails.rootMatch && (
                                    <TournamentResultTable matchResult={tournamentDetails.rootMatch} />
                                )}
                                {/* <Table className="font-body text-base">
                                    <TableHeader>
                                        <TableRow className="bg-amber-400 hover:bg-amber-400">
                                            <TableHead className="text-black font-bold text-center px-5">No.</TableHead>
                                            <TableHead className="text-black font-bold pl-3 w-1/5">Round of {tournamentDetails.matches.length}</TableHead>
                                            <TableHead className="text-black font-bold pl-3 w-1/5">Quarter-Final</TableHead>
                                            <TableHead className="text-black font-bold pl-3 w-1/5">Semi-Final</TableHead>
                                            <TableHead className="text-black font-bold pl-3 w-1/5">Final</TableHead>
                                            <TableHead className="text-black font-bold pl-3 w-1/5">Winner</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">A1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={4}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={8}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={16}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center bg-slate-100"></TableCell>
                                            <TableCell className="bg-slate-100"></TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">C1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">D1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">E1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={4}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">F1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">G1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">H1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">I1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={4}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={8}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">J1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">K1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">L1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">M1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={4}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">N1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">O1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                            <TableCell rowSpan={2}>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow className="hover:bg-transparent h-10">
                                            <TableCell className="text-center">P1</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                    <p>Shi Yu Qi</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table> */}
                            </div>

                            <div className="w-full my-5 matches">
                                <h2 className="text-lg rounded-lg font-body font-bold pb-2 uppercase">Matches</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {tournamentDetails?.matches?.map((match, matchIndex: number) => (
                                        <div key={match.id} className="w-full border border-slate-200 bg-white rounded-lg font-body">
                                            <h2 className="text-base border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">{`Match ${matchIndex + 1}`}</h2>
                                            <div className="text-slate-600">
                                                {match.games.map((game) => (
                                                    <>
                                                        <div key={game.id} className="border-b border-slate-200 px-6 py-2 flex justify-between">
                                                            <p className="text-slate-500">{`Set ${game.setNum}`}</p>
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Pencil stroke="#FFC107" strokeWidth="3" size={18} />
                                                                </AlertDialogTrigger>

                                                                <AlertDialogContent className="bg-white">
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Update Results for this Set</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Enter the updated scores for each player in the set.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>

                                                                    <SetEditForm
                                                                        initialPlayer1Score={game.player1Score ?? 0}
                                                                        initialPlayer2Score={game.player2Score ?? 0}
                                                                        player1Name={String(match.player1Id)}
                                                                        player2Name={String(match.player2Id)}
                                                                    />

                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                        <div className="flex justify-center border-b border-slate-200">
                                                            <div
                                                                className={`w-2/5 flex items-center justify-start gap-2 px-4 py-5 text-black font-bold ${(game.player1Score !== null && game.player2Score !== null) && game.player1Score > game.player2Score ? 'bg-green-100' : ''
                                                                    }`}
                                                            >
                                                                <p>{match.player1Id}</p>
                                                                <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                            </div>
                                                            <div className="w-1/5 flex items-center justify-center gap-2 px-4 py-5 font-bold">
                                                                <p>{game.player1Score !== null ? game.player1Score : '?'} - {game.player2Score !== null ? game.player2Score : '?'}</p>
                                                            </div>
                                                            <div
                                                                className={`w-2/5 flex items-center justify-start gap-2 px-4 py-5 text-black font-bold ${(game.player1Score !== null && game.player2Score !== null) && game.player1Score < game.player2Score ? 'bg-green-100' : ''
                                                                    }`}
                                                            >
                                                                <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                                <p>{match.player2Id}</p>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
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