"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PartyPopper, BicepsFlexed, Medal, CirclePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import './styles.css';
import { useState } from "react";
import Link from 'next/link';
import TournamentCard from "./_components/TournamentCard";
import Pagination from "./_components/Pagination";

export default function Tournaments() {
    const [activeTab, setActiveTab] = useState('all');

    // Pagination states for each tab
    const [currentAllPage, setCurrentAllPage] = useState(1);
    const [currentCompletedPage, setCurrentCompletedPage] = useState(1);
    const [currentOngoingPage, setCurrentOngoingPage] = useState(1);
    const [currentUpcomingPage, setCurrentUpcomingPage] = useState(1);

    const itemsPerPage = 12;

    const tournamentData = {
        all: [
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Registration Open",
                numMatches: null,
                tournamentId: 1,
                role: null,
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Champions Cup 2024",
                date: "Friday, 15 October 2024",
                time: "3:00 PM",
                status: "Registration Open",
                numMatches: null,
                tournamentId: 2,
                role: "user",
                isRegistered: true,
                availForMatchMake: null,
            },
            {
                name: "Champions Cup 2024",
                date: "Friday, 15 October 2024",
                time: "3:00 PM",
                status: "Registration Open",
                numMatches: null,
                tournamentId: 3,
                role: "user",
                isRegistered: false,
                availForMatchMake: null,
            },
            {
                name: "Champions Cup 2024",
                date: "Friday, 15 October 2024",
                time: "3:00 PM",
                status: "Scheduled",
                numMatches: null,
                tournamentId: 4,
                role: "user",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Registration Closed",
                numMatches: null,
                tournamentId: 5,
                role: "user",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Ongoing",
                numMatches: 16,
                tournamentId: 6,
                role: "user",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Completed",
                numMatches: 16,
                tournamentId: 7,
                role: "user",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Registration Open",
                numMatches: null,
                tournamentId: 8,
                role: "admin",
                isRegistered: null,
                availForMatchMake: false,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Registration Closed",
                numMatches: null,
                tournamentId: 9,
                role: "admin",
                isRegistered: null,
                availForMatchMake: true,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Ongoing",
                numMatches: 16,
                tournamentId: 10,
                role: "admin",
                isRegistered: null,
                availForMatchMake: false,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Ongoing",
                numMatches: 16,
                tournamentId: 11,
                role: "admin",
                isRegistered: null,
                availForMatchMake: true,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Completed",
                numMatches: 16,
                tournamentId: 12,
                role: "admin",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Completed",
                numMatches: 16,
                tournamentId: 13,
                role: "admin",
                isRegistered: null,
                availForMatchMake: null,
            }
        ],
        completed: [
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Completed",
                numMatches: 16,
                tournamentId: 7,
                role: "user",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Completed",
                numMatches: 16,
                tournamentId: 12,
                role: "admin",
                isRegistered: null,
                availForMatchMake: null,
            }
        ],
        ongoing: [
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Ongoing",
                numMatches: 16,
                tournamentId: 6,
                role: "user",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Ongoing",
                numMatches: 16,
                tournamentId: 10,
                role: "admin",
                isRegistered: null,
                availForMatchMake: false,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Ongoing",
                numMatches: 16,
                tournamentId: 11,
                role: "admin",
                isRegistered: null,
                availForMatchMake: true,
            },

        ],
        upcoming: [
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Registration Open",
                numMatches: null,
                tournamentId: 1,
                role: null,
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Champions Cup 2024",
                date: "Friday, 15 October 2024",
                time: "3:00 PM",
                status: "Registration Open",
                numMatches: null,
                tournamentId: 2,
                role: "user",
                isRegistered: true,
                availForMatchMake: null,
            },
            {
                name: "Champions Cup 2024",
                date: "Friday, 15 October 2024",
                time: "3:00 PM",
                status: "Registration Open",
                numMatches: null,
                tournamentId: 3,
                role: "user",
                isRegistered: false,
                availForMatchMake: null,
            },
            {
                name: "Champions Cup 2024",
                date: "Friday, 15 October 2024",
                time: "3:00 PM",
                status: "Scheduled",
                numMatches: null,
                tournamentId: 4,
                role: "user",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Registration Closed",
                numMatches: null,
                tournamentId: 5,
                role: "user",
                isRegistered: null,
                availForMatchMake: null,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Registration Open",
                numMatches: null,
                tournamentId: 8,
                role: "admin",
                isRegistered: null,
                availForMatchMake: false,
            },
            {
                name: "Wyse Active International 2024",
                date: "Thursday, 10 October 2024",
                time: "12:30 PM",
                status: "Registration Closed",
                numMatches: null,
                tournamentId: 9,
                role: "admin",
                isRegistered: null,
                availForMatchMake: true,
            },
        ],
    };

    const tournamentCount = {
        all: tournamentData.all.length,
        completed: tournamentData.completed.length,
        ongoing: tournamentData.ongoing.length,
        upcoming: tournamentData.upcoming.length,
    };

    const totalPages = {
        all: Math.ceil(tournamentData.all.length / itemsPerPage),
        completed: Math.ceil(tournamentData.completed.length / itemsPerPage),
        ongoing: Math.ceil(tournamentData.ongoing.length / itemsPerPage),
        upcoming: Math.ceil(tournamentData.upcoming.length / itemsPerPage),
    };

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    const paginatedTournaments = (data: any[], currentPage: number) => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    };

    return (
        <div className="w-[80%] mx-auto py-16">
            {/* tournament stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-9 lg:mb-11">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Completed <Medal size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{tournamentCount.completed}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Ongoing <BicepsFlexed size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{tournamentCount.ongoing}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Upcoming <PartyPopper size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{tournamentCount.upcoming}</div>
                    </CardContent>
                </Card>
            </div>

            {/* tournament cards */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="flex flex-wrap items-center justify-between">
                    <TabsContent value="all" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">All Tournaments</h1>
                            <Link href="/tournaments/form/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="completed" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Completed Tournaments</h1>
                            <Link href="/tournaments/form/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Ongoing Tournaments</h1>
                            <Link href="/tournaments/form/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="upcoming" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Upcoming Tournaments</h1>
                            <Link href="/tournaments/form/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>
                        </div>
                    </TabsContent>

                    <TabsList className="TabsList px-2 py-6 rounded-lg">
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="all">
                            All
                            {activeTab === 'all' && <Badge className="ml-2 px-1.5">{tournamentCount.all}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="completed">
                            Completed
                            {activeTab === 'completed' && <Badge className="ml-2 px-1.5">{tournamentCount.completed}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="ongoing">
                            Ongoing
                            {activeTab === 'ongoing' && <Badge className="ml-2 px-1.5">{tournamentCount.ongoing}</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="upcoming">
                            Upcoming
                            {activeTab === 'upcoming' && <Badge className="ml-2 px-1.5">{tournamentCount.upcoming}</Badge>}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                        {paginatedTournaments(tournamentData.all, currentAllPage).map((tournament) => (
                            <TournamentCard key={tournament.tournamentId} {...tournament} />
                        ))}
                    </div>
                    {totalPages.all > 1 && (
                        <Pagination
                            currentPage={currentAllPage}
                            totalPages={totalPages.all}
                            onPageChange={setCurrentAllPage}
                        />
                    )}
                </TabsContent>

                <TabsContent value="completed">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                        {paginatedTournaments(tournamentData.completed, currentCompletedPage).map((tournament) => (
                            <TournamentCard key={tournament.tournamentId} {...tournament} />
                        ))}
                    </div>
                    {totalPages.completed > 1 && (
                        <Pagination
                            currentPage={currentCompletedPage}
                            totalPages={totalPages.completed}
                            onPageChange={setCurrentCompletedPage}
                        />
                    )}
                </TabsContent>

                <TabsContent value="ongoing">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                        {paginatedTournaments(tournamentData.ongoing, currentOngoingPage).map((tournament) => (
                            <TournamentCard key={tournament.tournamentId} {...tournament} />
                        ))}
                    </div>
                    {totalPages.ongoing > 1 && (
                        <Pagination
                            currentPage={currentOngoingPage}
                            totalPages={totalPages.ongoing}
                            onPageChange={setCurrentOngoingPage}
                        />
                    )}
                </TabsContent>

                <TabsContent value="upcoming">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                        {paginatedTournaments(tournamentData.upcoming, currentUpcomingPage).map((tournament) => (
                            <TournamentCard key={tournament.tournamentId} {...tournament} />
                        ))}
                    </div>
                    {totalPages.upcoming > 1 && (
                        <Pagination
                            currentPage={currentUpcomingPage}
                            totalPages={totalPages.upcoming}
                            onPageChange={setCurrentUpcomingPage}
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}