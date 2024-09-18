import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { LandPlot, PartyPopper, BicepsFlexed, Medal, CirclePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import './styles.css';
import { Button } from "@/components/ui/button";

export default function StatsDashboard() {
    return (
        <div className="w-[80%] mx-auto py-16">
            {/* tournament stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-11">
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
                            Completed <Medal size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">23</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Upcoming <PartyPopper size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl flex justify-between">
                            Ongoing <BicepsFlexed size={28} />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                    </CardContent>
                </Card>
            </div>

            {/* tournament cards */}
            <Tabs defaultValue="upcoming" className="w-[100%]">
                <div className="flex flex-wrap items-center justify-between">
                    <TabsContent value="all" className="mr-8 py-5">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">All Tournaments</h1>
                            <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="completed" className="mr-8 py-5">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Completed Tournaments</h1>
                            <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing" className="mr-8 py-5">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Ongoing Tournaments</h1>
                            <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create</Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="upcoming" className="mr-8 py-5">
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl mr-5">Upcoming Tournaments</h1>
                            <Button className="text-base tracking-wider bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg"><CirclePlus className="mr-2" size={18} />Create</Button>
                        </div>
                    </TabsContent>
                    
                    <TabsList className="TabsList px-2 py-6 rounded-lg py-5">
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="all">All</TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="completed">Completed</TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="ongoing">Ongoing</TabsTrigger>
                        <TabsTrigger className="TabsTrigger text-base px-4 py-1" value="upcoming">Upcoming</TabsTrigger>
                    </TabsList>
                </div>
                <TabsContent value="all">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
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
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Unregister</Button>
                                    {/* <Button className="bg-red-500 hover:bg-red-700 text-white">Register</Button> */}
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
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    {/* <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Unregister</Button> */}
                                    <Button className="bg-red-500 hover:bg-red-700 text-white">Register</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="completed">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="ongoing">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
                <TabsContent value="upcoming">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-6">
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
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Unregister</Button>
                                    {/* <Button className="bg-red-500 hover:bg-red-700 text-white">Register</Button> */}
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
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    {/* <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Unregister</Button> */}
                                    <Button className="bg-red-500 hover:bg-red-700 text-white">Register</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 w-full">
                                    <Button style={{ backgroundColor: '#01205E' }}>View</Button>
                                    <Button style={{ backgroundColor: '#FFC107', color: '#000' }}>Edit</Button>
                                    <Button>Delete</Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}