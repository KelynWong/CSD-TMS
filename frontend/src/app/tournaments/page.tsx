"use client";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { PartyPopper, BicepsFlexed, Medal, CirclePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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

import './styles.css';
import { useState } from "react";
import Link from 'next/link'

export default function Tournaments() {
    const [activeTab, setActiveTab] = useState('upcoming');

    const handleTabChange = (value: string) => {
        setActiveTab(value);
    };

    return (
        <div className="w-[80%] mx-auto py-16">
            {/* tournament stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 md:mb-9 lg:mb-11">
                {/* <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            All <LandPlot size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">30</div>
                    </CardContent>
                </Card> */}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Upcoming <PartyPopper size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">12</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Ongoing <BicepsFlexed size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">8</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Completed <Medal size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">43</div>
                    </CardContent>
                </Card>
            </div>

            {/* tournament cards */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <div className="flex flex-wrap items-center justify-between">
                    <TabsContent value="all" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">All Tournaments</h1>
                            <Link href="/tournaments/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="completed" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Completed Tournaments</h1>
                            <Link href="/tournaments/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Ongoing Tournaments</h1>
                            <Link href="/tournaments/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>
                        </div>
                    </TabsContent>
                    <TabsContent value="upcoming" className="mr-8 py-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Upcoming Tournaments</h1>
                            <Link href="/tournaments/create"><Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create New</Button></Link>
                        </div>
                    </TabsContent>

                    <TabsList className="TabsList px-2 py-6 rounded-lg">
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="all">
                            All
                            {activeTab === 'all' && <Badge className="ml-2 px-1.5">63</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="completed">
                            Completed
                            {activeTab === 'completed' && <Badge className="ml-2 px-1.5">43</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="ongoing">
                            Ongoing
                            {activeTab === 'ongoing' && <Badge className="ml-2 px-1.5">8</Badge>}
                        </TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="upcoming">
                            Upcoming
                            {activeTab === 'upcoming' && <Badge className="ml-2 px-1.5">12</Badge>}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="all">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                        {/* what user will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                    {/* <AlertDialog>
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
                                    </AlertDialog> */}
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
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                    {/* <AlertDialog>
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
                                    </AlertDialog> */}
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                    {/* <AlertDialog>
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
                                    </AlertDialog> */}
                                </div>
                            </CardFooter>
                        </Card>
                        {/* what admin will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    <div className="grid grid-cols-1 w-full">
                                        <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">Matchmake</Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    <div className="grid grid-cols-1 w-full">
                                        <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        {/* what user will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        {/* what admin will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    <div className="grid grid-cols-1 w-full">
                                        <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    <div className="grid grid-cols-1 w-full">
                                        <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                    <Pagination className="mt-10 justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious className="text-base" href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink className="text-base" href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink className="text-base" href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink className="text-base" href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis className="text-base" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext className="text-base" href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </TabsContent>

                <TabsContent value="completed">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                        {/* what user will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        {/* what admin will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                            </CardFooter>
                        </Card>
                    </div>
                    <Pagination className="mt-10 justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious className="text-base" href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink className="text-base" href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink className="text-base" href="#">2</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext className="text-base" href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </TabsContent>

                <TabsContent value="ongoing">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                        {/* what user will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        {/* what admin will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    <div className="grid grid-cols-1 w-full">
                                        <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    <div className="grid grid-cols-1 w-full">
                                        <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1">16 Matches</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="upcoming">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
                        {/* what public will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                </div>
                            </CardFooter>
                        </Card>
                        {/* what user will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
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
                                    {/* <AlertDialog>
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
                                    </AlertDialog> */}
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                    {/* <AlertDialog>
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
                                    </AlertDialog> */}
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
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                    {/* <AlertDialog>
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
                                    </AlertDialog> */}
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-cols-1 w-full">
                                    <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                    {/* <AlertDialog>
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
                                    </AlertDialog> */}
                                </div>
                            </CardFooter>
                        </Card>
                        {/* what admin will see */}
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    <div className="grid grid-cols-1 w-full">
                                        <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic">Registration open</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    <div className="grid grid-cols-1 w-full">
                                        <Button className="bg-gray-300 hover:bg-gray-300 text-gray-400">MatchMake</Button>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                        <Card>
                            <CardHeader className="p-0 pt-20 rounded-t-lg cardImg">
                                <div className="bg-gradient-to-t from-black to-transparent"><CardTitle className="p-4 text-lg text-white leading-6 text-pretty">Wyse Active International 2024</CardTitle></div>
                            </CardHeader>
                            <CardContent className="p-6 py-3">
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">📅</p>
                                    <p>Thursday, 10 October 2024</p>
                                </div>
                                <div className="my-1 flex items-start">
                                    <p className="mr-1.5">⏰</p>
                                    <p>12:30 PM</p>
                                </div>
                                <p className="my-1 italic text-red-600">Registration closed</p>
                            </CardContent>
                            <CardFooter>
                                <div className="grid grid-row-2 gap-2 w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                                        <Link href="/tournament/Details"><Button style={{ backgroundColor: '#01205E' }} className=" w-full">View</Button></Link>
                                        <Button className="text-black bg-amber-400 hover:bg-amber-500">Edit</Button>
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
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}