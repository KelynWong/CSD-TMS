import * as React from "react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "./TimePickerInput";
import { Period } from "./TimePickerUtils";
import { TimePeriodSelect } from "./TimePeriodSelect";

interface TimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  const [period, setPeriod] = React.useState<Period>((date?.getHours() ?? 0) >= 12 ? "PM" : "AM");

  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const periodRef = React.useRef<HTMLButtonElement>(null);

  const handleHourChange = (hour: string) => {
    if (date) {
      let updatedHour = parseInt(hour, 10);
      if (period === "PM" && updatedHour < 12) {
        updatedHour += 12;
      } else if (period === "AM" && updatedHour === 12) {
        updatedHour = 0;
      }
      const updatedDate = new Date(date);
      updatedDate.setHours(updatedHour);
      setDate(updatedDate);
    }
  };

  const handleMinuteChange = (minute: string) => {
    if (date) {
      const updatedDate = new Date(date);
      updatedDate.setMinutes(parseInt(minute, 10));
      setDate(updatedDate);
    }
  };

  const handlePeriodChange = () => {
    if (date) {
      const updatedDate = new Date(date);
      if (period === "AM") {
        setPeriod("PM");
        updatedDate.setHours(updatedDate.getHours() + 12);
      } else {
        setPeriod("AM");
        updatedDate.setHours(updatedDate.getHours() - 12);
      }
      setDate(updatedDate);
    }
  };

  return (
    <div className="flex items-end gap-2">
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Hours
        </Label>
        <TimePickerInput
          picker="12hours"
          period={period}
          date={date}
          setDate={(date) => handleHourChange((date ?? new Date()).getHours().toString())}
          ref={hourRef}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutes
        </Label>
        <TimePickerInput
          picker="minutes"
          id="minutes12"
          date={date}
          setDate={(date) => handleMinuteChange((date ?? new Date()).getMinutes().toString())}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => periodRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="period" className="text-xs">
          Period
        </Label>
        <TimePeriodSelect
          period={period}
          setPeriod={handlePeriodChange}
          date={date}
          setDate={setDate}
          ref={periodRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div>
    </div>
  );
}
