import * as React from "react";
import { Button } from "@/components/ui/button";// Button component for user interaction

// Define the type for the time period
export type Period = "AM" | "PM"; // Time period can only be "AM" or "PM"

// Props interface for the TimePeriodSelect component
interface TimePeriodSelectProps {
  period: Period; // Current selected period ("AM" or "PM")
  setPeriod: (period: Period) => void; // Function to update the period
  date: Date | undefined; // Current selected date (optional)
  setDate: (date: Date | undefined) => void; // Function to update the date
  onLeftFocus?: () => void; // Optional callback for handling "ArrowLeft" key focus
}

// TimePeriodSelect Component
// Allows users to toggle between "AM" and "PM" using a button
export const TimePeriodSelect = React.forwardRef<HTMLButtonElement, TimePeriodSelectProps>(
  ({ period, setPeriod, onLeftFocus }, ref) => {
    // Handler to toggle between "AM" and "PM"
    const handleTogglePeriod = () => {
      const newPeriod = period === "AM" ? "PM" : "AM";
      setPeriod(newPeriod);
    };

    return (
      <div className="flex items-center">
        {/* Button to toggle the time period */}
        <Button
          ref={ref} // Forwarded ref for the button
          onClick={handleTogglePeriod} // Toggle the period when the button is clicked
          onKeyDown={(e) => {
            // Handle keyboard interaction
            if (e.key === "ArrowLeft" && onLeftFocus) {
              onLeftFocus(); // Call the optional "ArrowLeft" focus callback if provided
            }
          }}
          className="font-body bg-white hover:bg-slate-100 text-black text-base px-4 py-2"
        >
          {/* Display the current period ("AM" or "PM") */}
          {period}
        </Button>
      </div>
    );
  }
);