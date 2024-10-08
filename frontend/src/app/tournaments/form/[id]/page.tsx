"use client"

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TimePicker } from "../../_components/TimePicker";
import { createTournaments, updateTournaments, fetchTournaments } from "@/api/tournaments/api";
import Loading from "@/components/Loading";

const formSchema = z.object({
    tournamentName: z.string().min(2, { message: "Tournament name must be at least 2 characters." }),
    // location: z.string().min(2, { message: "Location must be at least 2 characters." }),
    // description: z.string().optional(),
    startDT: z.date(),
    endDT: z.date(),
    status: z.string(),
    regStartDT: z.date(),
    regEndDT: z.date(),
});

export default function TournamentForm() {
    const router = useRouter();
    const { id } = useParams();
    const isEditing = id && id !== 'create';
    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

    type TournamentData = {
        tournamentName: string;
        startDT: Date;
        endDT: Date;
        status: string;
        regStartDT: Date;
        regEndDT: Date;
    };
    const [initialData, setInitialData] = useState<TournamentData | null>(null);
    const [loading, setLoading] = useState(false);

    const today = startOfDay(new Date());
    const defaultStart = addDays(new Date(), 10);
    defaultStart.setHours(9, 0, 0, 0); // Sets time to 9:00 AM

    const defaultEnd = addDays(new Date(), 14);
    defaultEnd.setHours(18, 0, 0, 0); // Sets time to 6:00 PM

    const defaultRegStart = addDays(new Date(), 1);
    defaultRegStart.setHours(0, 0, 0, 0); // Sets time to 12:00 AM

    const defaultRegEnd = addDays(new Date(), 7);
    defaultRegEnd.setHours(23, 59, 0, 0); // Sets time to 11:59 PM

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            tournamentName: "",
            // location: "",
            // description: "",
            startDT: defaultStart,
            endDT: defaultEnd,
            status: "Scheduled",
            regStartDT: defaultRegStart,
            regEndDT: defaultRegEnd
        },
    });

    // Fetching data if in edit mode
    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            const getTournamentsData = async () => {
                try {
                    const data = await fetchTournaments();
                    
                    const selectedTournament = data.find((tournament) => tournament.id === Number(id));
                    if (selectedTournament) {
                        setInitialData({
                            ...selectedTournament,
                            startDT: new Date(new Date(selectedTournament.startDT).getTime() + sgTimeZoneOffset),
                            endDT: new Date(new Date(selectedTournament.endDT).getTime() + sgTimeZoneOffset),
                            regStartDT: new Date(new Date(selectedTournament.regStartDT).getTime() + sgTimeZoneOffset),
                            regEndDT: new Date(new Date(selectedTournament.regEndDT).getTime() + sgTimeZoneOffset),
                        });
                    } else {
                        console.error("Tournament not found");
                    }
                } catch (err) {
                    console.error("Failed to fetch tournaments:", err);
                }
            };
            getTournamentsData();
            setLoading(false);
        }
    }, [id, isEditing]);

    useEffect(() => {
        if (initialData) {
            form.reset(initialData); // Reset the form with fetched data
        }
    }, [initialData, form]);

    const onSubmit = async (data: any) => {
        setLoading(true);
        
        const payload = {
            ...data,
            startDT: data.startDT.toISOString(),
            endDT: data.endDT.toISOString(),
            regStartDT: data.regStartDT.toISOString(),
            regEndDT: data.regEndDT.toISOString(),
            ...(isEditing && { id: id }),
        };
    
        console.log(payload);
        const response = await (isEditing ? updateTournaments(payload) : createTournaments(payload));
    
        if (response) {
            setLoading(false);
            alert(`Tournament ${isEditing ? 'updated' : 'created'} successfully!`);
            router.push('/tournaments');
        } else {
            setLoading(false);
            alert(`Failed to ${isEditing ? 'update' : 'create'} tournament`);
        }
    };    

    // Handle form reset manually
    const handleReset = () => {
        form.reset(initialData || {
            tournamentName: "",
            // location: "",
            // description: "",
            startDT: defaultStart,
            endDT: defaultEnd,
            status: "Scheduled",
            regStartDT: defaultStart,
            regEndDT: defaultEnd
        });
    };

    if (loading) {
		return <Loading />;
	}

    return (
        <div className="w-[80%] mx-auto py-16">
            <h1 className="text-3xl mr-5 mb-6 text-center">{isEditing ? 'Edit' : 'Create'} Tournament</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="tournamentName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg block">Tournament Name</FormLabel>
                                <FormControl className="block">
                                    <Input placeholder="Enter tournament name" {...field} className="font-body bg-white" />
                                </FormControl>
                                <FormDescription>
                                    This will be the name displayed for the tournament.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg block">Tournament Description</FormLabel>
                                <FormControl className="block">
                                    <Textarea className="font-body bg-white" placeholder="Provide details about the tournament" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Add a brief description of the tournament (optional).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    {/* <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg block">Location</FormLabel>
                                <FormControl className="block">
                                    <Input placeholder="Enter location" {...field} className="font-body bg-white" />
                                </FormControl>
                                <FormDescription>
                                    Specify the location for the tournament.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    /> */}

                    <div className="grid grid-cols-2 gap-16">
                        <FormField
                            control={form.control}
                            name="startDT"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg block">Start Date and Time</FormLabel>
                                    <FormControl className="block">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-body bg-white",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP, hh:mm aaa") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 font-body">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={(date: any) => {
                                                        // Set the date part while preserving the time
                                                        const currentDate = field.value ?? defaultStart;
                                                        const updatedDate = new Date(date);
                                                        updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
                                                        field.onChange(updatedDate);
                                                    }}
                                                    initialFocus
                                                    disabled={(date: any) => isBefore(date, today)} // Disable past dates
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePicker setDate={(newDate) => {
                                                        const selectedDate = field.value ?? defaultStart;
                                                        const updatedDate = new Date(selectedDate);
                                                        updatedDate.setHours(newDate?.getHours() ?? 0, newDate?.getMinutes() ?? 0);
                                                        field.onChange(updatedDate);
                                                    }} date={field.value} />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        Set the start date for the tournament.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDT"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg block">End Date and Time</FormLabel>
                                    <FormControl className="block">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-body bg-white",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP, hh:mm aaa") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 font-body">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={(date: any) => {
                                                        // Set the date part while preserving the time
                                                        const currentDate = field.value ?? defaultEnd;
                                                        const updatedDate = new Date(date);
                                                        updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
                                                        field.onChange(updatedDate);
                                                    }}
                                                    initialFocus
                                                    disabled={(date: any) => isBefore(date, today)} // Disable past dates
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePicker setDate={(newDate) => {
                                                        const selectedDate = field.value ?? defaultEnd;
                                                        const updatedDate = new Date(selectedDate);
                                                        updatedDate.setHours(newDate?.getHours() ?? 0, newDate?.getMinutes() ?? 0);
                                                        field.onChange(updatedDate);
                                                    }} date={field.value} />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        Set the end date for the tournament.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-16">
                        <FormField
                            control={form.control}
                            name="regStartDT"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg block">Registeration Start Date and Time</FormLabel>
                                    <FormControl className="block">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-body bg-white",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP, hh:mm aaa") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 font-body">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={(date: any) => {
                                                        // Set the date part while preserving the time
                                                        const currentDate = field.value ?? defaultStart;
                                                        const updatedDate = new Date(date);
                                                        updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
                                                        field.onChange(updatedDate);
                                                    }}
                                                    initialFocus
                                                    disabled={(date: any) => isBefore(date, today)} // Disable past dates
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePicker setDate={(newDate) => {
                                                        const selectedDate = field.value ?? defaultStart;
                                                        const updatedDate = new Date(selectedDate);
                                                        updatedDate.setHours(newDate?.getHours() ?? 0, newDate?.getMinutes() ?? 0);
                                                        field.onChange(updatedDate);
                                                    }} date={field.value} />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        Set the start date for the tournament.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="regEndDT"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg block">Registeration End Date and Time</FormLabel>
                                    <FormControl className="block">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-body bg-white",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP, hh:mm aaa") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 font-body">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={(date: any) => {
                                                        // Set the date part while preserving the time
                                                        const currentDate = field.value ?? defaultEnd;
                                                        const updatedDate = new Date(date);
                                                        updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
                                                        field.onChange(updatedDate);
                                                    }}
                                                    initialFocus
                                                    disabled={(date: any) => isBefore(date, today)} // Disable past dates
                                                />
                                                <div className="p-3 border-t border-border">
                                                    <TimePicker setDate={(newDate) => {
                                                        const selectedDate = field.value ?? defaultEnd;
                                                        const updatedDate = new Date(selectedDate);
                                                        updatedDate.setHours(newDate?.getHours() ?? 0, newDate?.getMinutes() ?? 0);
                                                        field.onChange(updatedDate);
                                                    }} date={field.value} />
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        Set the end date for the tournament.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg block">Status of Tournament</FormLabel>
                                <FormControl className="block">
                                    <Select
                                        value={field.value} // Bind value to form state
                                        onValueChange={field.onChange} // Bind onChange to form state
                                    >
                                        <SelectTrigger className="w-full font-body bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="font-body">
                                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                                            <SelectItem value="RegistrationOpen">Registration Open</SelectItem>
                                            <SelectItem value="RegistrationClosed">Registration Closed</SelectItem>
                                            <SelectItem value="Ongoing">Ongoing</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormDescription>
                                    Specify the status of the tournament.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-center space-x-4">
                        <Button type="button" variant="outline" className="text-base" onClick={handleReset}>Cancel</Button>
                        <Button type="submit" className="text-base">{isEditing ? 'Update' : 'Submit'}</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}