"use client"

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addDays, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { createTournaments, updateTournaments, fetchTournamentById } from "@/api/tournaments/api";
import Loading from "@/components/Loading";
import { useUserContext } from "@/context/userContext";
import { message } from "antd";
import {useNavBarContext} from "@/context/navBarContext";
import { TournamentData } from "@/types/tournamentFormData";
import { CalendarWithTime } from "../../_components/CalendarWithTime";

// define validation schema using zod
const formSchema = z.object({
    tournamentName: z.string().min(2, { message: "Tournament name must be at least 2 characters." }),
    startDT: z.date(),
    endDT: z.date(),
    regStartDT: z.date(),
    regEndDT: z.date(),
});

export default function TournamentForm() {
    const router = useRouter();
    const { id } = useParams();

    // get user context for authentication and role
    const { user } = useUserContext();

    // set current navigation state
    const { setState } = useNavBarContext();
    setState("tournaments");

    // determine if form is for editing or creating a tournament
    const isEditing = id && id !== 'create';
    const sgTimeZoneOffset = 8 * 60 * 60 * 1000;

    // form states
    const [initialData, setInitialData] = useState<TournamentData | null>(null); // stores initial data for editing
    const [loading, setLoading] = useState(false); // loading indicator for API calls

    // default date constants for form fields
    const today = startOfDay(new Date());
    const DEFAULT_DATES = {
        start: (() => {
            const date = addDays(today, 10);
            date.setHours(9, 0, 0, 0); // Set time to 9:00 AM
            return date;
        })(),
        end: (() => {
            const date = addDays(today, 14);
            date.setHours(18, 0, 0, 0); // Set time to 6:00 PM
            return date;
        })(),
        regStart: (() => {
            const date = addDays(today, 1);
            date.setHours(0, 0, 0, 0); // Set time to 12:00 AM
            return date;
        })(),
        regEnd: (() => {
            const date = addDays(today, 7);
            date.setHours(23, 59, 0, 0); // Set time to 11:59 PM
            return date;
        })(),
    };

    // react Hook Form setup with default values n validation schema
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            tournamentName: "",
            startDT: DEFAULT_DATES.start,
            endDT: DEFAULT_DATES.end,
            regStartDT: DEFAULT_DATES.regStart,
            regEndDT: DEFAULT_DATES.regEnd,
        },
    });

    // fetch tournament data if editing an existing tournament
    useEffect(() => {
        if (isEditing) {
            fetchInitialData();
        }
    }, [isEditing]);

    // Reset form fields with fetched initial data when available.
    useEffect(() => {
        if (initialData) {
            form.reset(initialData); // Reset the form with fetched data
        }
    }, [initialData, form]);

    // Fetch initial data for editing mode.
    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const data = await fetchTournamentById(Number(id));
            setInitialData({
                ...data,
                startDT: new Date(new Date(data.startDT).getTime() + sgTimeZoneOffset),
                endDT: new Date(new Date(data.endDT).getTime() + sgTimeZoneOffset),
                regStartDT: new Date(new Date(data.regStartDT).getTime() + sgTimeZoneOffset),
                regEndDT: new Date(new Date(data.regEndDT).getTime() + sgTimeZoneOffset),
            });
        } catch (error) {
            message.error("Failed to fetch tournament data.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handle form submission for creating or updating a tournament.
     * @param data - The form data collected from user input.
     */
    const onSubmit = async (data: { startDT: { toISOString: () => any; }; endDT: { toISOString: () => any; }; regStartDT: { toISOString: () => any; }; regEndDT: { toISOString: () => any; }; }) => {
        setLoading(true);
        try {
            const payload = {
                ...data, // Include form data
                // Convert dates to ISO strings for backend compatibility
                startDT: data.startDT.toISOString(),
                endDT: data.endDT.toISOString(),
                regStartDT: data.regStartDT.toISOString(),
                regEndDT: data.regEndDT.toISOString(),
                ...(isEditing && initialData && { // Merge initialData if editing
                    ...initialData,
                    ...data, // Override with form data
                    id: Number(id) // Ensure id is included as a number
                }),
                ...(!isEditing && { createdBy: user.id }) // Include createdBy if not editing
            };

            // Call the appropriate API based on the form mode
            const response = isEditing ? await updateTournaments(payload) : await createTournaments(payload);
            if (response) {
                message.success(`Tournament ${isEditing ? "updated" : "created"} successfully!`);
                router.push("/tournaments");
            } else {
                throw new Error();
            }
        } catch {
            message.error(`Failed to ${isEditing ? "update" : "create"} tournament.`);
        } finally {
            setLoading(false);
        }
    };
    
    // Handle cancel/reset action by redirecting to the tournaments list.
    const handleCancel = () => {
        router.push("/tournaments");
    };

    // Show loading spinner while fetching data or submitting
    if (loading) return <Loading />;
    
    return (
        <div className="w-[80%] mx-auto py-16">
            <h1 className="text-3xl mr-5 mb-6 text-center">{isEditing ? 'Edit' : 'Create'} Tournament</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Tournament Name */}
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

                    {/* Date and Time Fields */}
                    <div className="grid grid-cols-2 gap-8">
                        {["startDT", "endDT", "regStartDT", "regEndDT"].map((fieldName) => (
                            <CalendarWithTime
                                key={fieldName}
                                control={form.control}
                                name={fieldName}
                                label={
                                    {
                                        startDT: "Start Date and Time",
                                        endDT: "End Date and Time",
                                        regStartDT: "Registration Start Date and Time",
                                        regEndDT: "Registration End Date and Time",
                                    }[fieldName] || ""
                                }
                                description={`Set the ${
                                    fieldName.includes("reg") ? "registration" : "tournament"
                                } ${fieldName.includes("Start") ? "start" : "end"} date.`}
                                defaultValue={DEFAULT_DATES[fieldName as keyof typeof DEFAULT_DATES]}
                                today={today}
                            />
                        ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4">
                        <Button type="button" variant="outline" className="text-base" onClick={handleCancel}>Cancel</Button>
                        <Button type="submit" className="text-base">{isEditing ? 'Update' : 'Submit'}</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}