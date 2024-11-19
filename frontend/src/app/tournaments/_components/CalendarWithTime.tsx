import React from "react";
import { Control } from "react-hook-form";
import { format, isBefore } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TimePicker } from "./TimePicker";

type CalendarWithTimeProps = {
    control: Control<any>; // React Hook Form's control object
    name: string; // Field name
    label: string; // Label for the field
    description?: string; // Optional description
    defaultValue?: Date; // Default date and time value
    today: Date; // Minimum date allowed (e.g., today)
};

export const CalendarWithTime: React.FC<CalendarWithTimeProps> = ({
    control,
    name,
    label,
    description,
    defaultValue,
    today,
}) => {
    return (
        <FormField
            name={name}
            control={control}
            defaultValue={defaultValue ?? null}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-lg block">{label}</FormLabel>
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
                                    {field.value
                                        ? format(field.value, "PPP, hh:mm aaa")
                                        : "Pick a date and time"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 font-body">
                                <Calendar
                                    mode="single"
                                    selected={field.value ?? undefined}
                                    onSelect={(date) => {
                                        if (!date) return;

                                        const currentDate = field.value ?? defaultValue;
                                        const updatedDate = new Date(date);
                                        updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
                                        field.onChange(updatedDate);
                                    }}
                                    initialFocus
                                    disabled={(date) => isBefore(date, today)} // Disable past dates
                                />
                                <div className="p-3 border-t border-border">
                                    <TimePicker
                                        setDate={(newDate) => {
                                            if (!newDate) return;

                                            const selectedDate = field.value ?? defaultValue;
                                            const updatedDate = new Date(selectedDate);
                                            updatedDate.setHours(newDate?.getHours() ?? 0, newDate?.getMinutes() ?? 0);
                                            field.onChange(updatedDate);
                                        }}
                                        date={field.value}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormDescription>
                        {description}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
