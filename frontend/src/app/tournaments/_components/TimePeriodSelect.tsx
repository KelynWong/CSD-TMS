import * as React from "react";
import { Button } from "@/components/ui/button";

export type Period = "AM" | "PM";

interface TimePeriodSelectProps {
  period: Period;
  setPeriod: (period: Period) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  onLeftFocus?: () => void;
}

export const TimePeriodSelect = React.forwardRef<HTMLButtonElement, TimePeriodSelectProps>(
  ({ period, setPeriod, onLeftFocus }, ref) => {
    const handleTogglePeriod = () => {
      const newPeriod = period === "AM" ? "PM" : "AM";
      setPeriod(newPeriod);
    };

    return (
      <div className="flex items-center">
        <Button
          ref={ref}
          onClick={handleTogglePeriod}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" && onLeftFocus) {
              onLeftFocus();
            }
          }}
          className="font-body bg-white hover:bg-slate-100 text-black text-base px-4 py-2"
        >
          {period}
        </Button>
      </div>
    );
  }
);