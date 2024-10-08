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

export default function Tournaments() {
    const role = "admin";
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
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
    const [currentAllPage, setCurrentAllPage] = useState(1);
    const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
    const [currentOngoingPage, setCurrentOngoingPage] = useState(1);
    const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);
    
    const itemsPerPage = 12;

    useEffect(() => {
        const getTournamentsData = async () => {
            try {
                const data = await fetchTournaments();
                setLoading(false);
                const mappedData: Tournament[] = data.map((tournament: any) => ({
                    id: tournament.id,
                    tournamentName: tournament.tournamentName,
                    startDT: new Date(new Date(tournament.startDT).getTime() + sgTimeZoneOffset).toISOString(),
                    endDT: new Date(new Date(tournament.endDT).getTime() + sgTimeZoneOffset).toISOString(),
                    status: tournament.status,
                    regStartDT: new Date(new Date(tournament.regStartDT).getTime() + sgTimeZoneOffset).toISOString(),
                    regEndDT: new Date(new Date(tournament.regEndDT).getTime() + sgTimeZoneOffset).toISOString(),
                }));
                categorizeTournaments(mappedData);
            } catch (err) {
                console.error("Failed to fetch tournaments:", err);
            }
        };
        getTournamentsData();
    }, []);

    const categorizeTournaments = (data: Tournament[]) => {
        const completed = data.filter(tournament => tournament.status === 'Completed');
        const ongoing = data.filter(tournament => tournament.status === 'InProgress');
        const upcoming = data.filter(tournament => tournament.status === 'RegistrationStart' || tournament.status === 'Scheduled');
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
                            {role == "admin" ? (<Link href="/tournaments/form/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>) : null}
                        </div>
                    </TabsContent>
                    <TabsContent value="upcoming" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Upcoming Tournaments</h1>
                            {role == "admin" ? (<Link href="/tournaments/form/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>) : null}
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Ongoing Tournaments</h1>
                            {role == "admin" ? (<Link href="/tournaments/form/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>) : null}
                        </div>
                    </TabsContent>
                    <TabsContent value="completed" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Completed Tournaments</h1>
                            {role == "admin" ? (<Link href="/tournaments/form/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>) : null}
                        </div>
                    </TabsContent>

                    <TabsList className="TabsList px-2 py-6 rounded-lg">
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="all">
                            All
                            {activeTab === 'all' && <Badge className="ml-2 px-1.5">{tournamentCount.all}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="upcoming">
                            Upcoming
                            {activeTab === 'upcoming' && <Badge className="ml-2 px-1.5">{tournamentCount.upcoming}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="ongoing">
                            Ongoing
                            {activeTab === 'ongoing' && <Badge className="ml-2 px-1.5">{tournamentCount.ongoing}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="completed">
                            Completed
                            {activeTab === 'completed' && <Badge className="ml-2 px-1.5">{tournamentCount.completed}</Badge>}
                        </TabsTrigger>
                    </TabsList>
                </div>

                {(['all', 'upcoming', 'ongoing', 'completed'] as const).map((tab) => (
                    <TabsContent key={tab} value={tab}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                            {paginatedTournaments(categorizedTournaments[tab], tab === 'all' ? currentAllPage : tab === 'completed' ? currentCompletedPage : tab === 'ongoing' ? currentOngoingPage : currentUpcomingPage).map((tournament: Tournament) => (
                                <TournamentCard role={role} key={tournament.id} {...tournament} />
                            ))}
                        </div>
                        {totalPages[tab] > 1 && (
                            <Pagination
                                currentPage={tab === 'all' ? currentAllPage : tab === 'completed' ? currentCompletedPage : tab === 'ongoing' ? currentOngoingPage : currentUpcomingPage}
                                totalPages={totalPages[tab]}
                                onPageChange={tab === 'all' ? setCurrentAllPage : tab === 'completed' ? setCurrentCompletedPage : tab === 'ongoing' ? setCurrentOngoingPage : setCurrentUpcomingPage}
                            />
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}