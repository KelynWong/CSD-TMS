"use client"

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, isBefore, startOfDay } from "date-fns";

import { Calendar as CalendarIcon } from "lucide-react";
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

const formSchema = z.object({
    tournamentName: z.string().min(2, { message: "Tournament name must be at least 2 characters." }),
    location: z.string().min(2, { message: "Location must be at least 2 characters." }),
    description: z.string().optional(),
    startDate: z.date(),
    endDate: z.date(),
    status: z.string().default("scheduled"),
});

export default function TournamentForm() {
    const router = useRouter();
    const { id } = useParams();
    const isEditing = id && id !== 'create';
    const [initialData, setInitialData] = useState(null);

    const today = startOfDay(new Date());
    const defaultStart = addDays(new Date(), 1);
    const defaultEnd = addDays(new Date(), 7);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            tournamentName: "",
            location: "",
            description: "",
            startDate: defaultStart,
            endDate: defaultEnd,
            status: "scheduled",
        },
    });

    // Fetching data if in edit mode
    useEffect(() => {
        if (isEditing) {
            // TO CHANGE
            const fetchData = async () => {
                const response = await fetch(`/api/tournaments/${id}`);
                const data = await response.json();
                setInitialData(data);
            };
            fetchData().catch(console.error);
        }
    }, [id, isEditing]);

    useEffect(() => {
        if (initialData) {
            form.reset(initialData); // Reset the form with fetched data
        }
    }, [initialData, form]);

    const onSubmit = async (data: any) => {
        // TO CHANGE
        const apiUrl = isEditing ? `/api/tournaments/${id}` : `/api/tournaments`;
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(apiUrl, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            router.push('/tournaments');
        } else {
            const errorData = await response.json();
            alert(`Failed to process tournament: ${errorData.message}`);
        }
    };

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
                                <FormControl className="block mt-2">
                                    <Input placeholder="Enter tournament name" {...field} className="font-body bg-white" />
                                </FormControl>
                                <FormDescription>
                                    This will be the name displayed for the tournament.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg block">Tournament Description</FormLabel>
                                <FormControl className="block mt-2">
                                    <Textarea className="font-body bg-white" placeholder="Provide details about the tournament" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Add a brief description of the tournament (optional).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg block">Location</FormLabel>
                                <FormControl className="block mt-2">
                                    <Input placeholder="Enter location" {...field} className="font-body bg-white" />
                                </FormControl>
                                <FormDescription>
                                    Specify the location for the tournament.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-16">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg block">Start Date</FormLabel>
                                    <FormControl className="block mt-2">
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
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 font-body">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={(date: any) => field.onChange(date ?? defaultStart)}
                                                    initialFocus
                                                    disabled={(date: any) => isBefore(date, today)} // Disable past dates
                                                />
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
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg block">End Date</FormLabel>
                                    <FormControl className="block mt-2">
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
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 font-body">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ?? undefined}
                                                    onSelect={(date: any) => field.onChange(date ?? defaultEnd)}
                                                    initialFocus
                                                    disabled={(date: any) => isBefore(date, today)} // Disable past dates
                                                />
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
                                <FormControl className="block mt-2">
                                    <Select
                                        value={field.value} // Bind value to form state
                                        onValueChange={field.onChange} // Bind onChange to form state
                                    >
                                        <SelectTrigger className="w-full font-body bg-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="font-body">
                                            <SelectItem value="scheduled">Scheduled</SelectItem>
                                            <SelectItem value="registrationStart">Registration Start</SelectItem>
                                            <SelectItem value="registrationClose">Registration Close</SelectItem>
                                            <SelectItem value="inProgress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
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
                        <Button type="reset" variant="outline">Cancel</Button>
                        <Button type="submit">{isEditing ? 'Update' : 'Submit'}</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}