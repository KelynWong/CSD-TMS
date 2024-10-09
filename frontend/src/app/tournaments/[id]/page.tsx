"use client";

import "../../tournaments/styles.css";
import { useRouter, useParams } from 'next/navigation';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { fetchAllPlayersByTournament, fetchTournamentById } from "@/api/tournaments/api";
import { fetchGamesByMatchId, fetchMatchByTournamentId } from "@/api/matches/api";
import { fetchPlayer } from "@/api/users/api";
import TournamentResultTable from "../_components/TournamentResultTable";
import { fetchMatchMakingByTournamentId } from "@/api/matchmaking/api";

// const tournamentDetails = {
//     tournamentID: 1,
//     tournamentName: "DPC WEU 2021/2022 Tour 1: Division I",
//     startDate: "16/10/2024",
//     endDate: "26/10/2024",
//     registrationStartDate: "16/10/2024",
//     registrationEndDate: "26/10/2024",
//     status: "Scheduled",
//     organizer: "Kelyn",
//     player: [
//         {
//             name: "Kai Xuan",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Sonia",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Owen",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Lynette",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Kai Xuan",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Sonia",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Owen",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Lynette",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Kai Xuan",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Sonia",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Owen",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Lynette",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Kai Xuan",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Sonia",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Owen",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Lynetteeeeeeeeeeeee",
//             pic: "/images/china.png",
//         },
//         {
//             name: "Lynetteeeeeeeeeeeee",
//             pic: "/images/china.png",
//         },
//     ],
//     matches: [
//         {
//             matchId: 1,
//             player1Fullname: "Kai Xuan",
//             player2Fullname: "Owen",
//             winnerFullname: "Kai Xuan",
//             sets: [
//                 {
//                     setId: 1,
//                     setNum: 1,
//                     date: "November 28",
//                     player1Score: 2,
//                     player2Score: 0
//                 },
//                 {
//                     setId: 2,
//                     setNum: 2,
//                     date: "November 29",
//                     player1Score: 0,
//                     player2Score: 2
//                 },
//                 {
//                     setId: 3,
//                     setNum: 3,
//                     date: "November 30",
//                     player1Score: 4,
//                     player2Score: 0
//                 },
//             ],
//         },
//         {
//             matchId: 2,
//             player1Fullname: "Kai Xuan",
//             player2Fullname: "Owen",
//             winnerFullname: "Kai Xuan",
//             sets: [
//                 {
//                     setId: 4,
//                     setNum: 1,
//                     date: "December 2",
//                     player1Score: 2,
//                     player2Score: 0
//                 },
//                 {
//                     setId: 5,
//                     setNum: 2,
//                     date: "December 3",
//                     player1Score: 0,
//                     player2Score: 2
//                 },
//                 {
//                     setId: 6,
//                     setNum: 3,
//                     date: "December 4",
//                     player1Score: null,
//                     player2Score: null
//                 },
//             ],
//         },
//     ]
// };

export default function TournamentDetails() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [matchMakingDetails, setMatchMakingDetails] = useState<any>(null);
    const [tournamentDetails, setTournamentDetails] = useState<any>(null);
    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

    // Fetching data 
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            // Fetch tournament details
            const tournamentData = await fetchTournamentById(Number(id));
            console.log(tournamentData);

            // Fetch player details
            const playersData = await fetchAllPlayersByTournament(Number(id));

            // Fetch matches details
            const matchesData = await fetchMatchByTournamentId(Number(id));

            // Fetch matchmaking details
            const mmData = await fetchMatchMakingByTournamentId(Number(id));

            setMatchMakingDetails(mmData);

            // Adjust dates for timezone
            const formattedStartDT = new Date(new Date(tournamentData.startDT).getTime() + sgTimeZoneOffset);
            const startDate = new Intl.DateTimeFormat('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(formattedStartDT);
            const startTime = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(formattedStartDT);

            const formattedEndDT = new Date(new Date(tournamentData.endDT).getTime() + sgTimeZoneOffset);
            const endDate = new Intl.DateTimeFormat('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(formattedEndDT);
            const endTime = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(formattedEndDT);

            const formattedRegStartDT = new Date(new Date(tournamentData.regStartDT).getTime() + sgTimeZoneOffset);
            const regStartDate = new Intl.DateTimeFormat('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(formattedRegStartDT);
            const regStartTime = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(formattedRegStartDT);

            const formattedRegEndDT = new Date(new Date(tournamentData.regEndDT).getTime() + sgTimeZoneOffset);
            const regEndDate = new Intl.DateTimeFormat('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(formattedRegEndDT);
            const regEndTime = new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(formattedRegEndDT);

            const tournamentDetails = {
                tournamentID: tournamentData.id,
                tournamentName: tournamentData.tournamentName,
                startDate: `${startDate}, ${startTime}`,
                endDate: `${endDate}, ${endTime}`,
                registrationStartDate: `${regStartDate}, ${regStartTime}`,
                registrationEndDate: `${regEndDate}, ${regEndTime}`,
                status: tournamentData.status,
                organizer: tournamentData.createdBy,
                player: await Promise.all(
                    playersData.map(async (player) => {
                        const playerDetails = await fetchPlayer(player.id);
                        return {
                            name: playerDetails.username,
                            pic: playerDetails.profilePicture,
                        };
                    })
                ),
                matches: await Promise.all(
                    matchesData.map(async (match) => {
                        const games = await fetchGamesByMatchId(match.id);
                        return {
                            matchId: match.id,
                            player1Fullname: `Player ${match.player1Id}`,
                            player2Fullname: `Player ${match.player2Id}`,
                            winnerFullname: `Player ${match.winnerId}`,
                            sets: games.map((game) => ({
                                setId: game.id,
                                setNum: game.setNum,
                                player1Score: game.player1Score,
                                player2Score: game.player2Score,
                            })),
                        };
                    })
                ),
            };
            console.log(tournamentDetails);
            setTournamentDetails(tournamentDetails);
            setLoading(false);
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <Loading />;
    }

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
                                <span className="w-3/12">{tournamentDetails.registrationStartDate} - {tournamentDetails.registrationEndDate}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-9/12">Tournament Dates:</span>
                                <span className="w-3/12">{tournamentDetails.startDate} - {tournamentDetails.endDate}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-9/12">Status: </span>
                                <span className="w-3/12">{tournamentDetails.status}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                                <span className="w-9/12">No. of Match: </span>
                                <span className="w-3/12">{tournamentDetails.matches.length === 0 ? 'TBC' : tournamentDetails.matches.length}</span>
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
                                    <li>{tournamentDetails.player.length} players/teams participate in the tournament</li>
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
                                <CarouselComponent tournament={tournamentDetails} />
                            </div>
                        ) : (
                            <></>
                        )}
                    </div>

                    { tournamentDetails.status === "Ongoing" || tournamentDetails.status === "Completed" ? (
                        <>
                            <div className="w-full my-5 results">
                                <h2 className="text-lg rounded-t-lg font-body font-bold pb-2 uppercase">Results</h2>

                                <TournamentResultTable matchMakingDetails={matchMakingDetails} tournamentDetails={tournamentDetails} />
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
                                    {tournamentDetails.matches.map((match: { matchId: Key | null | undefined; sets: any[]; player1Fullname: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined; player2Fullname: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined; }, matchIndex: number) => (
                                        <div key={match.matchId} className="w-full border border-slate-200 bg-white rounded-lg font-body">
                                            <h2 className="text-base border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">{`Match ${matchIndex + 1}`}</h2>
                                            <div className="text-slate-600">
                                                {match.sets.map((set) => (
                                                    <>
                                                        <div key={set.setId} className="border-b border-slate-200 px-6 py-2 flex justify-between">
                                                            <p className="text-slate-500">{`Set ${set.setNum}`}</p>
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
                                                                        initialPlayer1Score={set.player1Score ?? 0}
                                                                        initialPlayer2Score={set.player2Score ?? 0}
                                                                        player1Name={String(match.player1Fullname)}
                                                                        player2Name={String(match.player2Fullname)}
                                                                    />

                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </div>
                                                        <div className="flex justify-center border-b border-slate-200">
                                                            <div
                                                                className={`w-2/5 flex items-center justify-start gap-2 px-4 py-5 text-black font-bold ${(set.player1Score !== null && set.player2Score !== null) && set.player1Score > set.player2Score ? 'bg-green-100' : ''
                                                                    }`}
                                                            >
                                                                <p>{match.player1Fullname}</p>
                                                                <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                            </div>
                                                            <div className="w-1/5 flex items-center justify-center gap-2 px-4 py-5 font-bold">
                                                                <p>{set.player1Score !== null ? set.player1Score : '?'} - {set.player2Score !== null ? set.player2Score : '?'}</p>
                                                            </div>
                                                            <div
                                                                className={`w-2/5 flex items-center justify-start gap-2 px-4 py-5 text-black font-bold ${(set.player1Score !== null && set.player2Score !== null) && set.player1Score < set.player2Score ? 'bg-green-100' : ''
                                                                    }`}
                                                            >
                                                                <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                                <p>{match.player2Fullname}</p>
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