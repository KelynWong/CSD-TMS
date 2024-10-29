"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PartyPopper, BicepsFlexed, Medal, CirclePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import './styles.css';
import { useEffect, useState } from "react";
import Link from 'next/link';
import TournamentCard from "./_components/TournamentCard";
import Pagination from "./_components/Pagination";
import { fetchTournaments } from "@/api/tournaments/api";
import { Tournament } from "@/types/tournament";
import Loading from "@/components/Loading";
import { useUserContext } from "@/context/userContext";
import { fetchUser } from "@/api/users/api";
import { useNavBarContext } from "@/context/navBarContext";

export default function Tournaments() {
    const { user } = useUserContext();
    const [role, setRole] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setState } = useNavBarContext();
    setState("tournaments");

    const [categorizedTournaments, setCategorizedTournaments] = useState<{
        all: Tournament[],
        completed: Tournament[],
        ongoing: Tournament[],
        upcoming: Tournament[]
    }>({
        all: [],
        completed: [],
        ongoing: [],
        upcoming: []
    });

    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

    // Pagination states for each tab
    const [currentPage, setCurrentPage] = useState({
        all: 1,
        completed: 1,
        ongoing: 1,
        upcoming: 1
    });

    const itemsPerPage = 12;

    useEffect(() => {
        if (user) {
            const getPlayerData = async () => {
                try {
                    const data = await fetchUser(user.id);
                    setRole(data.role);
                } catch (err) {
                    console.error("Failed to fetch player:", err);
                    setError("Failed to fetch player data.");
                } finally {
                    setLoading(false);
                }
            };
            getPlayerData();
        }
    }, [user]);

    useEffect(() => {
        const getTournamentsData = async () => {
            try {
                const data = await fetchTournaments();
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
                categorizeTournaments(mappedData);
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
                setError("Failed to fetch tournaments.");
            } finally {
                setLoading(false);
            }
        };
        getTournamentsData();
    }, []);

    const categorizeTournaments = (data: Tournament[]) => {
        const completed = data.filter(tournament => tournament.status === 'Completed');
        const ongoing = data.filter(tournament => tournament.status === 'Ongoing');
        const upcoming = data.filter(tournament => ['Scheduled', 'Registration Start', 'Registration Close'].includes(tournament.status));
        const all = data;

        setCategorizedTournaments({
            all,
            completed,
            ongoing,
            upcoming
        });
    };

    const tournamentCount = {
        all: categorizedTournaments.all.length,
        completed: categorizedTournaments.completed.length,
        ongoing: categorizedTournaments.ongoing.length,
        upcoming: categorizedTournaments.upcoming.length,
    };

    const totalPages = {
        all: Math.ceil(categorizedTournaments.all.length / itemsPerPage),
        completed: Math.ceil(categorizedTournaments.completed.length / itemsPerPage),
        ongoing: Math.ceil(categorizedTournaments.ongoing.length / itemsPerPage),
        upcoming: Math.ceil(categorizedTournaments.upcoming.length / itemsPerPage),
    };

    const handlePageChange = (tab: string, page: number) => {
        setCurrentPage(prevState => ({ ...prevState, [tab]: page }));
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    const paginatedTournaments = (data: any[], currentPage: number) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="w-[80%] mx-auto py-16">
                <h1 className="text-3xl font-bold text-start">Tournaments</h1>
                <div className="text-center text-md italic mt-16 text-red-500">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="w-[80%] mx-auto py-16">
            {/* tournament stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-9 lg:mb-11">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Upcoming <PartyPopper size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-heading font-bold">{tournamentCount.upcoming}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Ongoing <BicepsFlexed size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-heading font-bold">{tournamentCount.ongoing}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Completed <Medal size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-heading font-bold">{tournamentCount.completed}</div>
                    </CardContent>
                </Card>
            </div>

            {/* tournament cards */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="flex flex-wrap items-center justify-between">
                    <TabsContent value="all" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">All Tournaments</h1>
                            {role === "Admin" && (
                                <Link href="/tournaments/form/create">
                                    <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                                        <CirclePlus className="mr-2" size={18} />
                                        Create New
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="upcoming" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Upcoming Tournaments</h1>
                            {role === "Admin" && (
                                <Link href="/tournaments/form/create">
                                    <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                                        <CirclePlus className="mr-2" size={18} />
                                        Create New
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Ongoing Tournaments</h1>
                            {role === "Admin" && (
                                <Link href="/tournaments/form/create">
                                    <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                                        <CirclePlus className="mr-2" size={18} />
                                        Create New
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value="completed" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Completed Tournaments</h1>
                            {role === "Admin" && (
                                <Link href="/tournaments/form/create">
                                    <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg">
                                        <CirclePlus className="mr-2" size={18} />
                                        Create New
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </TabsContent>

                    <TabsList className="TabsList px-2 py-6 rounded-lg">
                        {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((tab) => (
                            <TabsTrigger key={tab} className="TabsTrigger text-base px-4 py-1" value={tab}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                {activeTab === tab && <Badge className="ml-2 px-1.5">{tournamentCount[tab]}</Badge>}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((tab) => (
                    <TabsContent key={tab} value={tab}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                            {paginatedTournaments(categorizedTournaments[tab], currentPage[tab]).length === 0 ? (
                                <div className="col-span-full text-center text-md italic mt-8">
                                    No tournaments found.
                                </div>
                            ) : (
                                paginatedTournaments(categorizedTournaments[tab], currentPage[tab]).map((tournament: Tournament) => (
                                    <TournamentCard role={role} key={tournament.id} {...tournament} />
                                ))
                            )}
                        </div>
                        {totalPages[tab] > 1 && (
                            <Pagination
                                currentPage={currentPage[tab]}
                                totalPages={totalPages[tab]}
                                onPageChange={(page) => handlePageChange(tab, page)}
                            />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}