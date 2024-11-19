import Link from 'next/link'; // Link for navigation
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"; // Card components for UI
import { Button } from "@/components/ui/button"; // Button component
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
} from "@/components/ui/alert-dialog"; // Alert Dialog components for confirmation dialogs
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"; // Select dropdown for matchmaking strategy
import { SetStateAction, useEffect, useState } from 'react'; // React hooks
import {
    fetchPlayerRegistrationStatus,
    deleteTournament,
    registerTournament,
    withdrawTournament,
    updateTournamentStatusById,
    fetchAllPlayersByTournament
} from "@/api/tournaments/api"; // Tournament-related API calls
import { fetchMatchByTournamentId } from '@/api/matches/api'; // API call to fetch matches
import Loading from "@/components/Loading"; // Loading component for loading state
import { useUserContext } from '@/context/userContext'; // Context for user data
import { matchMakeByTournamentId } from '@/api/matchmaking/api'; // API call for matchmaking
import { message } from "antd"; // Ant Design message for notifications
import { useRouter } from 'next/navigation'; // Next.js router for navigation

// Props for the TournamentCard component
interface TournamentCardProps {
    id: number; // Tournament ID
    tournamentName: string; // Name of the tournament
    startDT: string; // Start date and time
    endDT: string; // End date and time
    status: string; // Tournament status
    regStartDT: string; // Registration start date and time
    regEndDT: string; // Registration end date and time
    role: string | null; // User role (e.g., "PLAYER", "ADMIN")
}

// Main TournamentCard Component
export default function TournamentCard({ id, tournamentName, startDT, endDT, status, regStartDT, regEndDT, role }: TournamentCardProps) {
    const router = useRouter();
    const { user } = useUserContext(); // Fetch user data from context
    const [availForMatchMake, setAvailForMatchMake] = useState(false); // State to check if matchmaking is available
    const [isRegistered, setIsRegistered] = useState<boolean | null>(null); // State to track player registration
    const [playerCount, setPlayerCount] = useState(0); // Number of players in the tournament
    const [numMatches, setNumMatches] = useState(0); // Number of matches in the tournament
    const [loading, setLoading] = useState(true); // Loading state
    const [selectedStrategy, setSelectedStrategy] = useState('strongweak'); // Selected matchmaking strategy

    const handleValueChange = (value: SetStateAction<string>) => {
        setSelectedStrategy(value);
    };

    // Format and localize date/time strings
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

    // Fetch player registration status for players
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
    
    // Fetch player count and match count
    useEffect(() => {
        setLoading(true);
        const getPlayerCount = async () => {
            try {
                const playersData = await fetchAllPlayersByTournament(Number(id));
                setPlayerCount(playersData.length);
                setLoading(false);
            } catch (err) {
                console.log("Failed to fetch tournaments:", err);
            }
        };

        const getMatchCount = async () => {
            try {
                const data = await fetchMatchByTournamentId(id);
                setNumMatches(data.length);
                setLoading(false);
            } catch (err) {
                console.log("Failed to fetch tournaments:", err);
            }
        };
        getPlayerCount();
        getMatchCount();
    }, []);

    // Check if matchmaking is available
    useEffect(() => {
        if (status === 'Registration Close') {
            setAvailForMatchMake(true);
        } else {
            setAvailForMatchMake(false); 
        }
    }, [status]);

    // Handle Matchmaking
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
            setTimeout(() => {
                window.location.reload();
            }, 500); // Delay of 0.5 seconds before reloading
        }
    };

    // Player Registration and Withdrawal
    const registerPlayer = async () => {
        try {
            await registerTournament(id, user.id);
            message.success('Registration successful!');
            setTimeout(() => {
                window.location.reload();
            }, 500); // Delay of 0.5 seconds before reloading
        } catch (err) {
            message.error('Registration failed :(');
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
        }
    };
    
    // Delete tournament
    const handleDelete = async () => {
        try {
            await deleteTournament(id);
            message.success('Tournament deleted successfully! :)');
            setTimeout(() => {
                window.location.reload();
            }, 500); // Delay of 0.5 seconds before reloading
        } catch (error) {
            message.error('Failed to delete tournament :(');
        }
    };

    // Render loading screen
    if (loading) {
		return <Loading heightClass="h-full" />;
	}

    return (
        <Card className="flex flex-col justify-between h-full">
            {/* Tournament Header */}
            <CardHeader className="p-0 h-36 overflow-hidden justify-end rounded-t-lg cardImg">
                <div className="bg-gradient-to-t from-black to-transparent">
                    <CardTitle className="p-4 text-lg text-white leading-6 text-pretty">{tournamentName}</CardTitle>
                </div>
            </CardHeader>

            {/* Tournament Details */}
            <CardContent className="p-6 py-3 grow">
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

                {/* Tournament Status */}
                {status === 'Completed' || status === 'Ongoing' ? (
                    <p className={`my-1 ${status === 'Ongoing' ? 'text-yellow-500' : 'text-black-600'}`}>{status} ({numMatches} Matches)</p>
                ) : (
                    <p className={`my-1 italic ${status === 'Registration Close' ? 'text-red-600' : status === 'Registration Start' ? 'text-green-600' : status === 'Matchmake' ? 'text-green-600' : 'text-black-600'}`}>{status === 'Matchmake' ? 'Matchmake Successful': status}</p>
                )}
            </CardContent>

            {/* Footer with Actions */}
            <CardFooter className="mt-auto">
                {/* Render actions based on user role */}
                {role === "PLAYER" && status === 'Registration Start'? (
                    <div className={`grid grid-cols-1 w-full ${isRegistered === null ? '' : 'sm:grid-cols-2 gap-2'}`}>
                        <Link href={`/tournaments/${id}`}><Button style={{ backgroundColor: '#01205E' }} className="w-full hover:opacity-80">View</Button></Link>
                        
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
                            <Link href={`/tournaments/${id}`}><Button style={{ backgroundColor: '#01205E' }} className="w-full hover:opacity-80">View</Button></Link>
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
                        <Link href={`/tournaments/${id}`}><Button style={{ backgroundColor: '#01205E' }} className="w-full hover:opacity:80">View</Button></Link>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}
