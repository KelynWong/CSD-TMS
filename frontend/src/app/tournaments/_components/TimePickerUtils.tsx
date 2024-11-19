/**
 * Utility functions for time picker validation, formatting, and conversions
 */

/**
 * regular expression to check for valid hour format (01-23)
 */
export function isValidHour(value: string) {
    return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value); // Matches hours between 00 and 23
}

/**
 * regular expression to check for valid 12 hour format (01-12)
 */
export function isValid12Hour(value: string) {
    return /^(0[1-9]|1[0-2])$/.test(value); // Matches hours between 01 and 12
}

/**
 * regular expression to check for valid minute or second format (00-59)
 */
export function isValidMinuteOrSecond(value: string) {
    return /^[0-5][0-9]$/.test(value); // Matches minutes/seconds between 00 and 59
}

/**
 * Adjusts a numeric value to be within a specified range.
 * - If `loop` is true, values exceeding the max loop back to min and vice versa.
 * - If `loop` is false, values are clamped to the range.
 */
type GetValidNumberConfig = { max: number; min?: number; loop?: boolean };

export function getValidNumber(
    value: string,
    { max, min = 0, loop = false }: GetValidNumberConfig
) {
    let numericValue = parseInt(value, 10);

    if (!isNaN(numericValue)) {
        if (!loop) {
            if (numericValue > max) numericValue = max;
            if (numericValue < min) numericValue = min;
        } else {
            if (numericValue > max) numericValue = min; // Loop from max to min
            if (numericValue < min) numericValue = max; // Loop from min to max
        }
        return numericValue.toString().padStart(2, "0"); // Pad single digits with leading zero
    }

    return "00"; // Return default value for invalid input
}

/**
 * Validates and adjusts hour values for 24-hour format.
 */
export function getValidHour(value: string) {
    if (isValidHour(value)) return value; // Return as-is if valid
    return getValidNumber(value, { max: 23 }); // Clamp to 0-23
}

/**
 * Validates and adjusts hour values for 12-hour format.
 */
export function getValid12Hour(value: string) {
    if (isValid12Hour(value)) return value; // Return as-is if valid
    return getValidNumber(value, { min: 1, max: 12 }); // Clamp to 1-12
}

/**
 * Validates and adjusts minute or second values.
 */
export function getValidMinuteOrSecond(value: string) {
    if (isValidMinuteOrSecond(value)) return value; // Return as-is if valid
    return getValidNumber(value, { max: 59 }); // Clamp to 0-59
}

/**
 * Handles value changes using arrow keys, supporting looping within a range.
 */
type GetValidArrowNumberConfig = {
    min: number;
    max: number;
    step: number;
};

export function getValidArrowNumber(
    value: string,
    { min, max, step }: GetValidArrowNumberConfig
) {
    let numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
        numericValue += step; // Increment or decrement by step
        return getValidNumber(String(numericValue), { min, max, loop: true }); // Loop within range
    }
    return "00"; // Return default for invalid input
}

/**
 * Handles arrow key value changes for hours in 24-hour format.
 */
export function getValidArrowHour(value: string, step: number) {
    return getValidArrowNumber(value, { min: 0, max: 23, step });
}

/**
 * Handles arrow key value changes for hours in 12-hour format.
 */
export function getValidArrow12Hour(value: string, step: number) {
    return getValidArrowNumber(value, { min: 1, max: 12, step });
}

/**
 * Handles arrow key value changes for minutes or seconds.
 */
export function getValidArrowMinuteOrSecond(value: string, step: number) {
    return getValidArrowNumber(value, { min: 0, max: 59, step });
}

/**
 * Updates the minutes of a date object.
 */
export function setMinutes(date: Date, value: string) {
    const minutes = getValidMinuteOrSecond(value); // Validate and adjust minutes
    date.setMinutes(parseInt(minutes, 10));
    return date;
}

/**
 * Updates the seconds of a date object.
 */
export function setSeconds(date: Date, value: string) {
    const seconds = getValidMinuteOrSecond(value); // Validate and adjust seconds
    date.setSeconds(parseInt(seconds, 10));
    return date;
}

/**
 * Updates the hours of a date object (24-hour format).
 */
export function setHours(date: Date, value: string) {
    const hours = getValidHour(value); // Validate and adjust hours
    date.setHours(parseInt(hours, 10));
    return date;
}

/**
 * Updates the hours of a date object (12-hour format).
 */
export function set12Hours(date: Date, value: string, period: Period) {
    const hours = parseInt(getValid12Hour(value), 10); // Validate and adjust hours
    const convertedHours = convert12HourTo24Hour(hours, period); // Convert to 24-hour format
    date.setHours(convertedHours);
    return date;
}

export type TimePickerType = "minutes" | "seconds" | "hours" | "12hours";
export type Period = "AM" | "PM";

/**
 * Updates a date object based on the picker type (minutes, seconds, hours, or 12-hour format).
 */
export function setDateByType(
    date: Date,
    value: string,
    type: TimePickerType,
    period?: Period
) {
    switch (type) {
        case "minutes":
            return setMinutes(date, value);
        case "seconds":
            return setSeconds(date, value);
        case "hours":
            return setHours(date, value);
        case "12hours": {
            if (!period) return date; // Return unchanged if no period is provided
            return set12Hours(date, value, period);
        }
        default:
            return date;
    }
}

/**
 * Retrieves the value of a specific type (minutes, seconds, hours, or 12-hour format) from a date object.
 */
export function getDateByType(date: Date, type: TimePickerType) {
    switch (type) {
        case "minutes":
            return getValidMinuteOrSecond(String(date.getMinutes()));
        case "seconds":
            return getValidMinuteOrSecond(String(date.getSeconds()));
        case "hours":
            return getValidHour(String(date.getHours()));
        case "12hours":
            const hours = display12HourValue(date.getHours());
            return getValid12Hour(String(hours));
        default:
            return "00";
    }
}

/**
 * Adjusts time values using arrow keys for a specific picker type.
 */
export function getArrowByType(
    value: string,
    step: number,
    type: TimePickerType
) {
    switch (type) {
        case "minutes":
            return getValidArrowMinuteOrSecond(value, step);
        case "seconds":
            return getValidArrowMinuteOrSecond(value, step);
        case "hours":
            return getValidArrowHour(value, step);
        case "12hours":
            return getValidArrow12Hour(value, step);
        default:
            return "00";
    }
}

/**
 * handles value change of 12-hour input
 * 12:00 PM is 12:00
 * 12:00 AM is 00:00
 */
export function convert12HourTo24Hour(hour: number, period: Period) {
    if (period === "PM") { 
        // Add 12 for PM hours less than 12
        if (hour <= 11) {
            return hour + 12;
        } else {
            return hour;
        }
    } else if (period === "AM") { 
        // Convert 12 AM to 0
        if (hour === 12) return 0;
        return hour;
    }
    return hour;
}

/**
 * time is stored in the 24-hour form,
 * but needs to be displayed to the user
 * in its 12-hour representation
 */
export function display12HourValue(hours: number) {
    if (hours === 0 || hours === 12) return "12"; // Convert 0 or 12 hours to "12"
    if (hours >= 22) return `${hours - 12}`;
    if (hours % 12 > 9) return `${hours}`;
    return `0${hours % 12}`;
}  