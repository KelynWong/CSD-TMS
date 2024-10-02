"use client";

import "../../tournaments/styles.css";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Pencil } from "lucide-react";
import Link from 'next/link';
import SetEditForm from "../_components/SetEditForm";

const tournament = {
    tournamentID: 1,
    tournamentName: "DPC WEU 2021/2022 Tour 1: Division I",
    startDate: "16/10/2024",
    endDate: "26/10/2024",
    registrationStartDate: "16/10/2024",
    registrationEndDate: "26/10/2024",
    status: "Scheduled",
    organizer: "Kelyn",
    player: [
        {
            name: "Kai Xuan",
            pic: "/images/china.png",
        },
        {
            name: "Sonia",
            pic: "/images/china.png",
        },
        {
            name: "Owen",
            pic: "/images/china.png",
        },
        {
            name: "Lynette",
            pic: "/images/china.png",
        },
        {
            name: "Kai Xuan",
            pic: "/images/china.png",
        },
        {
            name: "Sonia",
            pic: "/images/china.png",
        },
        {
            name: "Owen",
            pic: "/images/china.png",
        },
        {
            name: "Lynette",
            pic: "/images/china.png",
        },
        {
            name: "Kai Xuan",
            pic: "/images/china.png",
        },
        {
            name: "Sonia",
            pic: "/images/china.png",
        },
        {
            name: "Owen",
            pic: "/images/china.png",
        },
        {
            name: "Lynette",
            pic: "/images/china.png",
        },
        {
            name: "Kai Xuan",
            pic: "/images/china.png",
        },
        {
            name: "Sonia",
            pic: "/images/china.png",
        },
        {
            name: "Owen",
            pic: "/images/china.png",
        },
        {
            name: "Lynetteeeeeeeeeeeee",
            pic: "/images/china.png",
        },
        {
            name: "Lynetteeeeeeeeeeeee",
            pic: "/images/china.png",
        },
    ],
    matches: [
        {
            matchId: 1,
            player1Fullname: "Kai Xuan",
            player2Fullname: "Owen",
            winnerFullname: "Kai Xuan",
            sets: [
                {
                    setId: 1,
                    setNum: 1,
                    date: "November 28",
                    player1Score: 2,
                    player2Score: 0
                },
                {
                    setId: 2,
                    setNum: 2,
                    date: "November 29",
                    player1Score: 0,
                    player2Score: 2
                },
                {
                    setId: 3,
                    setNum: 3,
                    date: "November 30",
                    player1Score: 4,
                    player2Score: 0
                },
            ],
        },
        {
            matchId: 2,
            player1Fullname: "Kai Xuan",
            player2Fullname: "Owen",
            winnerFullname: "Kai Xuan",
            sets: [
                {
                    setId: 4,
                    setNum: 1,
                    date: "December 2",
                    player1Score: 2,
                    player2Score: 0
                },
                {
                    setId: 5,
                    setNum: 2,
                    date: "December 3",
                    player1Score: 0,
                    player2Score: 2
                },
                {
                    setId: 6,
                    setNum: 3,
                    date: "December 4",
                    player1Score: null,
                    player2Score: null
                },
            ],
        },
    ]
};

export default function TournamentDetails() {

    return (
        <div className="w-full">
            <div className="w-full h-96 cardImg bg-center relative">
                <div className="h-full overlay"></div>
                <h1 className="w-[80%] text-4xl absolute top-2/4 left-2/4 text-white font-body font-bold text-center" style={{ transform: "translate(-50%, -50%)" }}>{tournament.tournamentName}</h1>
            </div>

            <div className="w-[80%] mx-auto py-16">
                <div className="w-full border border-slate-200 bg-white rounded-t-lg font-body">
                    <h2 className="text-lg border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">Tournament Information</h2>
                    <div className="text-slate-600">
                        <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                            <span className="w-9/12">Organizer:</span>
                            <span className="w-3/12">{tournament.organizer}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                            <span className="w-9/12">Registration Dates:</span>
                            <span className="w-3/12">{tournament.registrationStartDate} - {tournament.registrationEndDate}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                            <span className="w-9/12">Tournament Dates:</span>
                            <span className="w-3/12">{tournament.startDate} - {tournament.endDate}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200 px-6 py-3 font-semibold">
                            <span className="w-9/12">No. of Match: </span>
                            <span className="w-3/12">{tournament.matches.length}</span>
                        </div>
                        <div className="flex justify-between px-6 py-3 font-semibold">
                            <span className="w-9/12">Format:</span>
                            <span className="w-3/12">Automatic Matching</span>
                        </div>
                    </div>
                </div>

                <div className="w-full formatPlayer my-5 flex gap-4">
                    <div className="w-3/5 border border-slate-200 bg-white rounded-lg font-body">
                        <h2 className="text-lg border-b border-slate-200 bg-slate-100 rounded-t-lg font-body font-bold px-6 py-3 uppercase">formats</h2>
                        <div className="p-6 pt-4 text-slate-600">
                            <p className="mb-2">Participants</p>
                            <ul className="ml-3 list-disc list-inside">
                                <li>Six teams from the Upper Division of Season 2 of previous DPC season</li>
                                <li>Two teams from the Lower Division of Season 2 of previous DPC season</li>
                            </ul>

                            <p className="my-2">Standings</p>
                            <ul className="ml-3 list-disc list-inside">
                                <li>Single round-robin</li>
                                <li>All matches are Bo3</li>
                                <li>1st place team is qualified to the Major Playoffs</li>
                                <li>2nd place team is qualified to the Major Group Stage</li>
                                <li>3rd place team is qualified to the Major Wild Card</li>
                                <li>Bottom two teams are relegated to Division II for the next tour</li>
                                <li>Remaining teams remain in current division for the next tour</li>
                                <li>Bottom two teams are relegated to Division II for the next tour</li>
                                <li>Remaining teams remain in current division for the next tour</li>
                                <li>Bottom two teams are relegated to Division II for the next tour</li>
                                <li>Remaining teams remain in current division for the next tour</li>
                            </ul>
                        </div>
                    </div>

                    <div className="w-2/5 bg-white rounded-lg font-body">
                        <h2 className="text-lg rounded-t-lg font-body font-bold px-6 p-4 uppercase">Players</h2>
                        <Carousel opts={{ align: "start", }} className="m-6 mt-0">
                            <CarouselContent className="justify-content-center m-0">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {Array.from({ length: tournament.player.length }).map((_, index) => (
                                        <CarouselItem key={index} className="m-0 p-0">
                                            <Card className="border-2 border-yellow-400 rounded-lg">
                                                <CardContent className="flex flex-col items-center justify-items-center py-4 px-3">
                                                    <img src={tournament.player[index].pic} alt={tournament.player[index].name} className="rounded-full w-6 h-6" />
                                                    <p className="w-full text-center font-medium truncate pt-1.5">{tournament.player[index].name}</p>
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </div>
                            </CarouselContent>
                            {/* <CarouselPrevious />
                            <CarouselNext /> */}
                        </Carousel>
                    </div>
                </div>

                <div className="w-full my-5 results">
                    <h2 className="text-lg rounded-t-lg font-body font-bold pb-2 uppercase">Results</h2>
                    
                    <Table className="font-body text-base">
                        <TableHeader>
                            <TableRow className="bg-amber-400 hover:bg-amber-400">
                                <TableHead className="text-black font-bold text-center px-5">No.</TableHead>
                                <TableHead className="text-black font-bold pl-3 w-1/5">Round of {tournament.matches.length}</TableHead>
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
                    </Table>
                </div>

                <div className="w-full my-5 matches">
                    <h2 className="text-lg rounded-lg font-body font-bold pb-2 uppercase">Matches</h2>
                    <div className="flex gap-4">
                        {tournament.matches.map((match, matchIndex) => (
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
                                                            player1Name={match.player1Fullname}
                                                            player2Name={match.player2Fullname}
                                                        />

                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                            <div className="flex justify-center border-b border-slate-200">
                                                <div
                                                    className={`w-2/5 flex items-center justify-start gap-2 px-4 py-5 text-black font-bold ${
                                                    (set.player1Score !== null && set.player2Score !== null)  && set.player1Score > set.player2Score ? 'bg-green-100' : ''
                                                    }`}
                                                >
                                                    <p>{match.player1Fullname}</p>
                                                    <img src="/images/china.png" className="rounded-full w-6 h-6" />
                                                </div>
                                                <div className="w-1/5 flex items-center justify-center gap-2 px-4 py-5 font-bold">
                                                    <p>{set.player1Score !== null ? set.player1Score : '?'} - {set.player2Score !== null ? set.player2Score : '?'}</p>
                                                </div>
                                                <div
                                                    className={`w-2/5 flex items-center justify-start gap-2 px-4 py-5 text-black font-bold ${
                                                    (set.player1Score !== null && set.player2Score !== null) && set.player1Score < set.player2Score ? 'bg-green-100' : ''
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
            </div>
        </div>
    );
}