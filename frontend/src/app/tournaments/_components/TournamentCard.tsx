import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { use, useEffect, useState } from 'react';
import { deleteTournament } from "@/api/tournaments/api";
import { fetchMatchByTournamentID } from '@/api/matches/api';
import Loading from "@/components/Loading";
import { Match } from '@/types/match';

interface TournamentCardProps {
    id: number;
    tournamentName: string;
    startDT: string,
    endDT: string,
    status: string,
    regStartDT: string,
    regEndDT: string,
    role: string | null;
}

export default function TournamentCard({ id, tournamentName, startDT, endDT, status, regStartDT, regEndDT, role }: TournamentCardProps) {
    const [availForMatchMake, setAvailForMatchMake] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [numMatches, setNumMatches] = useState(0);
    const [loading, setLoading] = useState(true);
    const formattedStartDT = new Date(startDT);
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

    const formattedEndDT = new Date(endDT);
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

    const formattedRegStartDT = new Date(regStartDT);
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

    const formattedRegEndDT = new Date(regEndDT);
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

    useEffect(() => {
        const getMatchCount = async () => {
            try {
                const data = await fetchMatchByTournamentID(id);
                setLoading(false);
                const mappedData: Match[] = data.map((match: any) => ({
                    id: match.id,
                    tournamentId: match.tournamentId,
                    player1Id: match.player1Id,
                    player2Id: match.player2Id,
                    winnerId: match.winnerId,
                    left: match.left,
                    right: match.right,
                    games: match.games
                }));
                setNumMatches(mappedData.length);
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
            }
        };
        getMatchCount();
    }, []);

    if (status === 'Registration Closed') {
        setAvailForMatchMake(true)
    }

    const handleDelete = async () => {
        try {
            await deleteTournament(id); 
            alert('Tournament deleted successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete tournament:', error);
            alert('Failed to delete tournament.');
        }
    };

    // TO DO: call API to check if user is registered for tournament
    // useEffect(() => {
    //     const getUserRegisterationStatusData = async () => {
    //         try {
    //             const data = await fetchUserRegistrationStatus();
    //             setIsRegistered(data);
    //         } catch (err) {
    //             console.error("Failed to fetch user registration status:", err);
    //         }
    //     };
    //     getUserRegisteredData();
    // }, []);

    return (
        <Card>
            <CardHeader className="p-0 h-36 overflow-hidden justify-end rounded-t-lg cardImg">
                <div className="bg-gradient-to-t from-black to-transparent">
                    <CardTitle className="p-4 text-lg text-white leading-6 text-pretty">{tournamentName}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6 py-3">
                <div className="my-1 flex items-start">
                    <p className="mr-1.5">⛳️</p>
                    <p>{formattedStartDate}, {startTime}</p>
                </div>
                <div className="my-1 flex items-start">
                    <p className="mr-1.5">🏁</p>
                    <p>{formattedEndDate}, {endTime}</p>
                </div>
                {/* <p className={`my-1 ${status === 'Completed' || status === 'Ongoing' ? '' : 'italic'}`}>{status}</p> */}
                {status === 'Completed' || status === 'Ongoing' ? (
                    <p className="my-1">{numMatches} Matches</p>
                ) : (
                    <p className={`my-1 italic ${status === 'RegistrationClosed' ? 'text-red-600' : 'text-green-600'}`}>{status}</p>
                )}
            </CardContent>
            <CardFooter>
                {role === "user" && status === 'RegistrationOpen'? (
                    <div className={`grid grid-cols-1 w-full ${isRegistered === null ? '' : 'sm:grid-cols-2 gap-2'}`}>
                        <Link href={`/tournaments/${id}`}><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                        
                        {isRegistered !== null && (
                            isRegistered ? (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Unregister</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Unregistration</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to unregister from this tournament?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Unregister</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button className="bg-red-500 hover:bg-red-700 text-white">Register</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Registration</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                By registering, you agree to the tournament rules and conditions. Are you sure you want to register for this tournament?
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Register</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )
                        )}
                    </div>
                ) : role === "admin" ? (
                    <div className="grid grid-row-2 gap-2 w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            <Link href={`/tournaments/${id}`}><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                            <Link href={`/tournaments/form/${id}`}><Button className="text-black bg-amber-400 hover:bg-amber-500 w-full">Edit</Button></Link>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button>Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete the tournament and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        {availForMatchMake && (
                            <div className="grid grid-cols-1 w-full">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className="bg-red-500 hover:bg-red-700 text-white">MatchMake</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Matchmake</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                By proceeding, the system will proceed to Matchmake the players. 
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction>Start Matchmaking</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                {/* <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button> */}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 w-full">
                        <Link href={`/tournaments/${id}`}><Button style={{ backgroundColor: '#01205E' }} className="w-full">View</Button></Link>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
