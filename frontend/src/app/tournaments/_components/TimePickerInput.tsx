import { Input } from "@/components/ui/input"; // Input component for the text field
import { cn } from "@/lib/utils"; // Utility for conditional class names
import React from "react";
import {
  Period, // Type for "AM" or "PM"
  TimePickerType, // Type for time picker (e.g., "12hours", "minutes")
  getArrowByType, // Utility to handle arrow key increments
  getDateByType, // Utility to get the date value by picker type
  setDateByType, // Utility to set the date value by picker type
} from "./TimePickerUtils";

/**
 * Props for TimePickerInput
 * - picker: Specifies the type of picker ("12hours", "minutes", etc.)
 * - date: The current date object
 * - setDate: Function to update the date
 * - period: The current period ("AM"/"PM"), optional
 * - onRightFocus: Callback for when the right arrow key is pressed
 * - onLeftFocus: Callback for when the left arrow key is pressed
 */
export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker: TimePickerType;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  period?: Period;
  onRightFocus?: () => void;
  onLeftFocus?: () => void;
}
 
// TimePickerInput Component
// A reusable input field for entering time-related values (hours or minutes)
const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  TimePickerInputProps
>(
  (
    {
      className, // Additional CSS classes
      type = "tel", // Default input type is "tel" for numeric keypad
      value, // Current value of the input field
      id, // Input ID for accessibility
      name, // Name attribute for the input
      date = new Date(new Date().setHours(0, 0, 0, 0)), // Default date if none is provided
      setDate, // Function to update the date
      onChange, // Event handler for input change
      onKeyDown, // Event handler for key press
      picker, // Specifies if the picker is "12hours" or "minutes"
      period, // The current period ("AM" or "PM")
      onLeftFocus, // Callback for left arrow key
      onRightFocus, // Callback for right arrow key
      ...props // Remaining props
    },
    ref // Forwarded ref
  ) => {
    const [flag, setFlag] = React.useState<boolean>(false); // Tracks whether the user is entering the second digit
    const [prevIntKey, setPrevIntKey] = React.useState<string>("0"); // Tracks the previous key pressed

    /**
     * allow the user to enter the second digit within 2 seconds
     * otherwise start again with entering first digit
     */
    React.useEffect(() => {
      if (flag) {
        const timer = setTimeout(() => {
          setFlag(false); // Reset the flag
        }, 2000);
 
        return () => clearTimeout(timer); // Clear timeout on cleanup
      }
    }, [flag]);
 
    /**
     * Calculates the current value of the input based on the picker type and date
     */
    const calculatedValue = React.useMemo(() => {
      return getDateByType(date, picker); // Get the value (e.g., hours or minutes) based on picker type
    }, [date, picker]);
 
    /**
     * Determines the new value based on the user's keypress
     */
    const calculateNewValue = (key: string) => {
      /*
       * If picker is '12hours' and the first digit is 0, then the second digit is automatically set to 1.
       * The second entered digit will break the condition and the value will be set to 10-12.
       */
      if (picker === "12hours") {
        // Handle special case for "12hours" picker
        if (flag && calculatedValue.slice(1, 2) === "1" && prevIntKey === "0")
          return "0" + key; // Handle leading zero for "10-12"
      }
 
      // Append the new key as the second digit if the flag is set
      return !flag ? "0" + key : calculatedValue.slice(1, 2) + key;
    };
 
    /**
     * Handles keydown events for the input
     */
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Tab") return;// Ignore Tab key
      e.preventDefault(); // Prevent default behavior

       // Handle arrow navigation
      if (e.key === "ArrowRight") onRightFocus?.(); // Move focus to the next input
      if (e.key === "ArrowLeft") onLeftFocus?.(); // Move focus to the previous input

      // Handle arrow up/down for incrementing/decrementing
      if (["ArrowUp", "ArrowDown"].includes(e.key)) {
        const step = e.key === "ArrowUp" ? 1 : -1; // Determine increment or decrement
        const newValue = getArrowByType(calculatedValue, step, picker); // Get new value based on step
        if (flag) setFlag(false); // Reset flag
        const tempDate = new Date(date); // Clone the date
        setDate(setDateByType(tempDate, newValue, picker, period)); // Update the date
      }
      
      // Handle numeric key input
      if (e.key >= "0" && e.key <= "9") {
        if (picker === "12hours") setPrevIntKey(e.key); // Track previous key for "12hours" picker

        const newValue = calculateNewValue(e.key); // Calculate new value
        if (flag) onRightFocus?.(); // Move focus to the next input if flag is set
        setFlag((prev) => !prev); // Toggle the flag
        const tempDate = new Date(date); // Clone the date
        setDate(setDateByType(tempDate, newValue, picker, period)); // Update the date
      }
    };
 
    return (
      <Input
        ref={ref} // Forwarded ref for the input
        id={id || picker} // ID for the input
        name={name || picker} // Name attribute for the input
        className={cn(
          "w-[48px] text-center font-mono text-base tabular-nums caret-transparent focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none",
          className // Additional classes
        )}
        value={value || calculatedValue} // Use provided value or calculated value
        onChange={(e) => {
          e.preventDefault();
          onChange?.(e); // Trigger onChange callback if provided
        }}
        type={type} // Input type (default "tel")
        inputMode="decimal" // Use numeric keypad for mobile
        onKeyDown={(e) => {
          onKeyDown?.(e); // Trigger onKeyDown callback if provided
          handleKeyDown(e); // Handle keydown logic
        }}
        {...props} // Spread remaining props
      />
    );
  }
);
 
// Add a display name for debugging purposes
TimePickerInput.displayName = "TimePickerInput";
 
export { TimePickerInput };