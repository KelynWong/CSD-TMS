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
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { SetStateAction, useEffect, useState } from 'react';
import { fetchPlayerRegistrationStatus, deleteTournament, registerTournament, withdrawTournament, updateTournamentStatusById, fetchAllPlayersByTournament } from "@/api/tournaments/api";
import { fetchMatchByTournamentId } from '@/api/matches/api';
import Loading from "@/components/Loading";
import { useUserContext } from '@/context/userContext';
import { matchMakeByTournamentId } from '@/api/matchmaking/api';
import { message } from "antd";
import { useRouter } from 'next/navigation';

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
    const router = useRouter();
    const { user } = useUserContext();
    const [availForMatchMake, setAvailForMatchMake] = useState(false);
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null);
    const [playerCount, setPlayerCount] = useState(0);
    const [numMatches, setNumMatches] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showRegisterButton, setShowRegisterButton] = useState(false);
    const [selectedStrategy, setSelectedStrategy] = useState('strongweak');

    const handleValueChange = (value: SetStateAction<string>) => {
        setSelectedStrategy(value);
    };

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
        if (role === "PLAYER") {
            const getUserRegisteredData = async () => {
                setLoading(true);
                try {
                    const isRegisteredStatus = await fetchPlayerRegistrationStatus(id, user.id);
                    setIsRegistered(isRegisteredStatus);
                } catch (err) {
                    console.error("Failed to fetch player registration status:", err);
                } finally {
                    setLoading(false);
                }
            };
            getUserRegisteredData();
        }
    }, [user, role, id]);
    
    useEffect(() => {
        setLoading(true);
        const getPlayerCount = async () => {
            try {
                const playersData = await fetchAllPlayersByTournament(Number(id));
                setPlayerCount(playersData.length);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
            }
        };

        const getMatchCount = async () => {
            try {
                const data = await fetchMatchByTournamentId(id);
                setNumMatches(data.length);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
            }
        };
        getPlayerCount();
        getMatchCount();
    }, []);

    useEffect(() => {
        const currentDate = new Date();
        if (currentDate >= formattedRegStartDT && currentDate <= formattedRegEndDT) {
          setShowRegisterButton(true);
        } else {
          setShowRegisterButton(false);
        }
    }, [formattedRegStartDT, formattedRegEndDT]);

    useEffect(() => {
        if (status === 'Registration Close') {
            setAvailForMatchMake(true);
        } else {
            setAvailForMatchMake(false); 
        }
    }, [status]);

    const matchMake = async () => {
        setLoading(true);
        try {
            await matchMakeByTournamentId(id, selectedStrategy);
            await updateTournamentStatusById(id, "Matchmake");
            message.success('Matchmake successful! :)');
            setTimeout(() => {
                router.push(`/tournaments/${id}`);
            }, 500); // Delay of 0.5 seconds before reloading
        } catch (err) {
            message.error('Failed to matchmake :( \n' + err);
            console.log(err);
            setTimeout(() => {
                window.location.reload();
            }, 500); // Delay of 0.5 seconds before reloading
        }
    };

    const registerPlayer = async () => {
        try {
            await registerTournament(id, user.id);
            message.success('Registration successful!');
            setTimeout(() => {
                window.location.reload();
            }, 500); // Delay of 0.5 seconds before reloading
        } catch (err) {
            message.error('Registration failed :(');
            console.error("Failed to register for tournament:", err);
        }
    };

    const deRegisterPlayer = async () => {
        try {
            await withdrawTournament(id, user.id);
            message.success('Successfully withdrawn from tournament! :)');
            setTimeout(() => {
                window.location.reload();
            }, 500); // Delay of 0.5 seconds before reloading
        } catch (err) {
            message.error('Failed to withdraw from tournament :(');
            console.error("Failed to register for tournament:", err);
        }
    };
    
    const handleDelete = async () => {
        try {
            await deleteTournament(id);
            message.success('Tournament deleted successfully! :)');
            setTimeout(() => {
                window.location.reload();
            }, 500); // Delay of 0.5 seconds before reloading
        } catch (error) {
            console.error('Failed to delete tournament:', error);
            message.error('Failed to delete tournament :(');
        }
    };

    if (loading) {
		return <Loading heightClass="h-full" />;
	}

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
                <div className="my-1 flex items-start">
                    <p className="mr-1.5">🏸</p>
                    <p>{playerCount} players</p>
                </div>
                {status === 'Completed' || status === 'Ongoing' ? (
                    <p className={`my-1 ${status === 'Ongoing' ? 'text-yellow-500' : 'text-black-600'}`}>{status} ({numMatches} Matches)</p>
                ) : (
                    <p className={`my-1 italic ${status === 'Registration Close' ? 'text-red-600' : status === 'Registration Start' ? 'text-green-600' : status === 'Matchmake' ? 'text-green-600' : 'text-black-600'}`}>{status === 'Matchmake' ? 'Matchmake Successful': status}</p>
                )}
            </CardContent>
            <CardFooter>
                {role === "PLAYER" && status === 'Registration Start'? (
                    <div className={`grid grid-cols-1 w-full ${isRegistered === null ? '' : 'sm:grid-cols-2 gap-2'}`}>
                        <Link href={`/tournaments/${id}`}><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                        
                        {isRegistered ? (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button className="text-black bg-amber-400 hover:bg-amber-500">Withdraw</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Withdrawal</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to withdraw from this tournament?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="text-black bg-amber-400 hover:bg-amber-500" onClick={deRegisterPlayer}>Withdraw</AlertDialogAction>
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
                                        <AlertDialogAction className="bg-red-500 hover:bg-red-700 text-white" onClick={registerPlayer}>Register</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                ) : role === "ADMIN" ? (
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
                                        <Button className="bg-red-500 hover:bg-red-700 text-white">Matchmake</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-white">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Confirm Matchmake</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                <Select defaultValue="strongweak" onValueChange={handleValueChange}>
                                                    <SelectTrigger className="w-1/2 mb-2 text-black font-body">
                                                        <SelectValue placeholder="Select a Matchmake strategy" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectItem value="strongweak">Strong-Weak</SelectItem>
                                                            <SelectItem value="strongstrong">Strong-Strong</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                By proceeding, the system will proceed to Matchmake the players. 
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction className="bg-red-500 hover:bg-red-700 text-white" onClick={matchMake}>Start Matchmaking</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
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
