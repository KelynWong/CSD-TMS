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

interface TournamentCardProps {
    name: string;
    date: string;
    time: string;
    status: string;
    numMatches: number | null;
    tournamentId: number;
    role: string | null;
    isRegistered: boolean | null;
    availForMatchMake: boolean | null;
}

export default function TournamentCard({ name, date, time, status, numMatches, tournamentId, role, isRegistered, availForMatchMake }: TournamentCardProps) {
    return (
        <Card>
            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                <div className="bg-gradient-to-t from-black to-transparent">
                    <CardTitle className="p-4 text-lg text-white leading-6 text-pretty">{name}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6 py-3">
                <div className="my-1 flex items-start">
                    <p className="mr-1.5">📅</p>
                    <p>{date}</p>
                </div>
                <div className="my-1 flex items-start">
                    <p className="mr-1.5">⏰</p>
                    <p>{time}</p>
                </div>
                {/* <p className={`my-1 ${status === 'Completed' || status === 'Ongoing' ? '' : 'italic'}`}>{status}</p> */}
                {status === 'Completed' || status === 'Ongoing' ? (
                    <p className="my-1">{numMatches} Matches</p>
                ) : (
                    <p className={`my-1 italic ${status === 'Registration Closed' ? 'text-red-600' : ''}`}>{status}</p>
                )}
            </CardContent>
            <CardFooter>
                {role === "user" ? (
                    <div className={`grid grid-cols-1 w-full ${isRegistered === null ? '' : 'sm:grid-cols-2 gap-2'}`}>
                        <Link href="/tournament/detail/${tournamentId}"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                        
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
                            <Link href="/tournament/detail/${tournamentId}"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                            <Link href="/tournament/form/${tournamentId}"><Button className="text-black bg-amber-400 hover:bg-amber-500 w-full">Edit</Button></Link>
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
                                        <AlertDialogAction>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        { status !== "Completed" && (
                            <div className="grid grid-cols-1 w-full">
                                { availForMatchMake ? (
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
                                ) : (
                                    <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 w-full">
                        <Link href={`/tournament/detail/${tournamentId}`}><Button style={{ backgroundColor: '#01205E' }} className="w-full">View</Button></Link>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
