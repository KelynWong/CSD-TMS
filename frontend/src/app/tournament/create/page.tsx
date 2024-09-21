"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format, addDays, isBefore, startOfDay } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Define the validation schema using zod
const formSchema = z.object({
  tournamentName: z.string().min(2, {
    message: "Tournament name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  description: z.string().optional(),
  startDate: z.date({
    required_error: "Tournament start date is required",
  }),
  endDate: z.date({
    required_error: "Tournament end date is required",
  }),
});

export default function CreateTournamentPage() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tournamentName: "",
            location: "",
            description: "",
            startDate: null,
            endDate: null,
        },
    });

    const today = startOfDay(new Date());

    const defaultStart = addDays(new Date(), 1);
    const [startDate, setStartDate] = React.useState<Date>(defaultStart);

    const defaultEnd = addDays(new Date(), 7);
    const [endDate, setEndDate] = React.useState<Date>(defaultEnd);

    // Form submission handler
    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="w-[80%] mx-auto py-16">
        <h1 className="text-3xl mr-5 mb-6 text-center">Create Tournament</h1>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="tournamentName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg">Tournament Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter tournament name" {...field} className="font-body" />
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
                    name="location"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg">Location</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter location" {...field} className="font-body"/>
                        </FormControl>
                        <FormDescription>
                            Specify the location for the tournament.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="grid grid-cols-2">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg block">Start Date</FormLabel>
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-body",
                                                !startDate && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 font-body">
                                            <Calendar
                                                mode="single"
                                                selected={startDate ?? undefined}
                                                onSelect={(startDate) => setStartDate(startDate ?? defaultStart)}
                                                initialFocus
                                                disabled={(date) => isBefore(date, today)} // Disable past dates
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
                                <FormControl>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[280px] justify-start text-left font-body",
                                                !endDate && "text-muted-foreground"
                                            )}
                                            >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 font-body">
                                            <Calendar
                                                mode="single"
                                                selected={endDate ?? undefined}
                                                onSelect={(endDate) => setEndDate(endDate ?? defaultEnd)}
                                                initialFocus
                                                disabled={(date) => isBefore(date, today)} // Disable past dates
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
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-lg">Tournament Description</FormLabel>
                        <FormControl>
                        <Textarea placeholder="Provide details about the tournament" {...field} />
                        </FormControl>
                        <FormDescription>
                            Add a brief description of the tournament (optional).
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <div className="flex justify-center space-x-4">
                    <Button type="reset" variant="outline">Cancel</Button>
                    <Button type="submit">Submit</Button>
                </div>
            </form>
        </Form>
        </div>
    );
}