import React from "react";
import { Control } from "react-hook-form"; // Importing Control type from react-hook-form
import { format, isBefore } from "date-fns"; // Utility functions for date formatting and comparisons
import { Calendar as CalendarIcon } from "lucide-react"; // Icon for the calendar button
import { cn } from "@/lib/utils"; // Utility for conditionally combining class names
import { Button } from "@/components/ui/button"; // Button component
import { Calendar } from "@/components/ui/calendar"; // Calendar component
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Popover for dropdown-like UI
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"; // Form-related components
import { TimePicker } from "./TimePicker"; // Custom TimePicker component

// Type definition for component props
type CalendarWithTimeProps = {
    control: Control<any>; // React Hook Form's control object for managing form state
    name: string; // Name of the field, used to register in the form
    label: string; // Label displayed for the field
    description?: string; // Optional description for the field
    defaultValue?: Date; // Default date and time value
    today: Date; // Minimum selectable date (e.g., today)
};

// Main component: CalendarWithTime
// A combined calendar and time picker for selecting date and time
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
            name={name} // Name of the field
            control={control} // React Hook Form control
            defaultValue={defaultValue ?? null} // Default value if provided, else null
            render={({ field }) => (
                <FormItem>
                    {/* Label for the field */}
                    <FormLabel className="text-lg block">{label}</FormLabel>

                     {/* Main control area */}
                    <FormControl className="block">
                        <Popover>
                            {/* Button to trigger the popover */}
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full justify-start text-left font-body bg-white",
                                        !field.value && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {/* Display selected date and time or placeholder */}
                                    {field.value
                                        ? format(field.value, "PPP, hh:mm aaa") // Format date if selected
                                        : "Pick a date and time"}
                                </Button>
                            </PopoverTrigger>

                            {/* Popover content */}
                            <PopoverContent className="w-auto p-0 font-body">
                                <Calendar
                                    mode="single" // Single date selection
                                    selected={field.value ?? undefined} // Currently selected date
                                    onSelect={(date) => {
                                        if (!date) return; // Exit if no date selected

                                        // Preserve existing time when updating date
                                        const currentDate = field.value ?? defaultValue;
                                        const updatedDate = new Date(date);
                                        updatedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
                                        field.onChange(updatedDate); // Update field value
                                    }}
                                    initialFocus // Focus on the calendar when opened
                                    disabled={(date) => isBefore(date, today)} // Disable past dates
                                />

                                {/* Time picker component */}
                                <div className="p-3 border-t border-border">
                                    <TimePicker
                                        setDate={(newDate) => {
                                            if (!newDate) return; // Exit if no time selected

                                            // Preserve existing date when updating time
                                            const selectedDate = field.value ?? defaultValue;
                                            const updatedDate = new Date(selectedDate);
                                            updatedDate.setHours(newDate?.getHours() ?? 0, newDate?.getMinutes() ?? 0);
                                            field.onChange(updatedDate); // Update field value
                                        }}
                                        date={field.value} // Pass currently selected date to TimePicker
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </FormControl>
                    <FormDescription>
                        {description}
                    </FormDescription>

                    {/* Validation message */}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
