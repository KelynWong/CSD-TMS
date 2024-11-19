import * as React from "react";
import { Label } from "@/components/ui/label"; // Label component for input labels
import { TimePickerInput } from "./TimePickerInput"; // Input component for hours and minutes
import { Period } from "./TimePickerUtils"; // Period type ("AM" or "PM")
import { TimePeriodSelect } from "./TimePeriodSelect"; // Component for selecting "AM" or "PM"

/**
 * Props for the TimePicker component
 * - date: The currently selected date (or undefined if none is selected).
 * - setDate: Function to update the selected date.
 */
interface TimePickerProps {
  date: Date | undefined; // Current date
  setDate: (date: Date | undefined) => void; // Function to update the date
}

// TimePicker Component
// Allows users to select hours, minutes, and a period ("AM"/"PM") for a specific time
export function TimePicker({ date, setDate }: TimePickerProps) {
  // State for managing the selected period ("AM" or "PM")
  const [period, setPeriod] = React.useState<Period>((date?.getHours() ?? 0) >= 12 ? "PM" : "AM"); // Determine initial period based on the hour

  // Refs for managing focus between inputs
  const minuteRef = React.useRef<HTMLInputElement>(null); // Ref for minutes input
  const hourRef = React.useRef<HTMLInputElement>(null); // Ref for hours input
  const periodRef = React.useRef<HTMLButtonElement>(null); // Ref for period button

  // Handler to update the hour in the date
  const handleHourChange = (hour: string) => {
    if (date) {
      let updatedHour = parseInt(hour, 10);
      
      // Adjust the hour based on the selected period
      if (period === "PM" && updatedHour < 12) {
        updatedHour += 12; // Convert to 24-hour format for PM
      } else if (period === "AM" && updatedHour === 12) {
        updatedHour = 0; // Convert 12 AM to 0 hours
      }

      // Update the date with the new hour
      const updatedDate = new Date(date);
      updatedDate.setHours(updatedHour);
      setDate(updatedDate); // Update the date via setDate
    }
  };

  // Handler to update the minutes in the date
  const handleMinuteChange = (minute: string) => {
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setMinutes(parseInt(minute, 10));// Update minutes in the date
      setDate(updatedDate); // Update the date via setDate
    }
  };

  // Handler to toggle the period ("AM"/"PM") and update the date
  const handlePeriodChange = () => {
    if (date) {
      const updatedDate = new Date(date);

      // Toggle the period and adjust the hours accordingly
      if (period === "AM") {
        setPeriod("PM");
        updatedDate.setHours(updatedDate.getHours() + 12); // Add 12 hours for PM
      } else {
        setPeriod("AM");
        updatedDate.setHours(updatedDate.getHours() - 12); // Subtract 12 hours for AM
      }
      setDate(updatedDate); // Update the date via setDate
    }
  };

  return (
    <div className="flex items-end gap-2">
      {/* Hour Input */}
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="12hours" // Specify that this input handles hours in 12-hour format
          period={period} // Pass the current period ("AM"/"PM")
          date={date} // Current date
          setDate={(date) => handleHourChange((date ?? new Date()).getHours().toString())} // Handle hour changes
          ref={hourRef} // Ref for managing focus
          onRightFocus={() => minuteRef.current?.focus()} // Move focus to minutes input on "ArrowRight"
        />
      </div>

      {/* Minute Input */}
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes" // Specify that this input handles minutes
          id="minutes12" // ID for accessibility
          date={date} // Current date
          setDate={(date) => handleMinuteChange((date ?? new Date()).getMinutes().toString())} // Handle minute changes
          ref={minuteRef} // Ref for managing focus
          onLeftFocus={() => hourRef.current?.focus()} // Move focus to hours input on "ArrowLeft"
          onRightFocus={() => periodRef.current?.focus()} // Move focus to period button on "ArrowRight"
        />
      </div>

      {/* Period Selector ("AM"/"PM") */}
      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs">
          Period
        </Label>
        <TimePeriodSelect
          period={period} // Current period
          setPeriod={handlePeriodChange} // Toggle the period on selection
          date={date} // Current date
          setDate={setDate} // Update the date via setDate
          ref={periodRef} // Ref for managing focus
          onLeftFocus={() => minuteRef.current?.focus()} // Move focus to minutes input on "ArrowLeft"
        />
      </div>
    </div>
  );
}